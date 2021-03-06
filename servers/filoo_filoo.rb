#!/usr/bin/env ruby

# ===========================================================================
# Project:   FilooFiloo-1.0
# Copyright: ©2008-2009 Philippe Bourgau, Inc.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>
#
# ===========================================================================

require 'rubygems'
require 'sinatra'
require 'dm-core'
require 'dm-timestamps'
require 'json'

set :root, File.join(File.dirname(__FILE__),'..')

TIMEOUT = 30.0 / (24*60*60)

# connect DataMapper to a local sqlite file. 
DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://filoo_filoo.db")

class HighScore
  include DataMapper::Resource

  property :id, Serial
  property :player_name, Text, :required => true
  property :score, Integer, :required => true

  def url
    "/high_scores/#{self.id}"
  end

  def to_json(*a)
    {
      'guid'       => self.url, 
      'playerName' => self.player_name,
      'score'      => self.score 
    }.to_json(*a)
  end

  # keys that MUST be found in the json
  REQUIRED = [:player_name, :score]

  def self.parse_json(body)
    json = JSON.parse(body)
    ret = { :player_name => json['playerName'], :score => json['score'] }
    return nil if REQUIRED.find { |r| ret[r].nil? }
    ret
  end

end

class Player
  include DataMapper::Resource

  property :id, Serial
  property :name, Text, :required => true
  property :opponent, Integer
  property :board_string, Text
  property :score, Integer
  property :outcome, Text
  property :updated_at, DateTime

  def self.id2url(id)
    if id.nil?
      nil
    else
      "/players/#{id}"
    end
  end
  def self.url2id(url)
    if url.nil?
      nil
    elsif url =~ /^\/players\/(\d+)$/
      return $1.to_i
    else
      raise RuntimeError.new("Invalid url for a player \"#{url}\"")
    end
  end

  def url
    Player.id2url(self.id)
  end

  def to_json(*a)
    {
      'guid'        => self.url, 
      'name'        => self.name,
      'opponent'    => Player.id2url(self.opponent),
      'boardString' => self.board_string,
      'score'       => self.score,
      'outcome'     => self.outcome
    }.to_json(*a)
  end

  # keys that MUST be found in the json
  REQUIRED = [:name]

  def self.parse_json(body)
    json = JSON.parse(body)
    ret = { :name => json['name'],
            :opponent => Player.url2id(json['opponent']),
            :board_string => json['boardString'],
            :score => json['score'],
            :outcome => json['outcome'] }
    return nil if REQUIRED.find { |r| ret[r].nil? }
    ret
  end

end

class HttpException < Exception
  def self.wrap(e)
    HttpException.new(500, e.message + "\n\n" + e.backtrace.join("\n"))
  end
  def initialize(httpStatus, message)
    super(message)
    @httpStatus = httpStatus
  end
  attr_reader :httpStatus
end

def within_transaction
  httpException = HttpException.new(500, "Unknown")
  5.times do
    begin
      transaction = DataMapper::Transaction.new(DataMapper.repository(:default))
      transaction.begin
      transaction.within do
        yield
      end
      transaction.commit
      return

    rescue String => m
      transaction.rollback unless transaction.nil?
      error = HttpException.new(500, m)

    rescue HttpException => e
      transaction.rollback unless transaction.nil?
      error = e

    rescue Exception => e
      transaction.rollback unless transaction.nil?
      error = HttpException.new(500, e.message + "\n\n" + e.backtrace.join("\n"))

    end
  end
  halt(httpException.httpStatus, "Transaction failed: " + httpException.message)
end

def read_request(klass)
  result = klass.parse_json(request.body.read) rescue nil
  halt(401, 'Invalid JSON format.') if result.nil?
  return result
end

# upgrade your database as needed
DataMapper.auto_upgrade!

get '/high_scores' do
  content_type 'application/json'
  { 'content' => Array(HighScore.all) }.to_json
end

post '/high_scores' do
  opts = read_request(HighScore)

  score = HighScore.new(opts)
  halt(500, 'Could not save high score') unless score.save

  response['Location'] = score.url
  response.status = 201
end

get '/players/:id' do
  player = Player.get(params[:id]) rescue nil
  halt(404, 'Not Found') if player.nil?

  if (player.updated_at < (DateTime.now - TIMEOUT))
    player.outcome = "timeout"

  elsif !player.opponent.nil?
    opponent = Player.get(player.opponent)
    if (opponent.updated_at < (DateTime.now - TIMEOUT))
      player.outcome = "timeout"
    end
  end

  content_type 'application/json'
  { 'content' => player }.to_json
end

# Debug purpose only
get '/players' do
  content_type 'application/json'
  { 'content' => Array(Player.all) }.to_json
end

# create a new player
post '/players' do
  opts = read_request(Player)

  within_transaction do
    waiting_player = Player.first(:opponent => nil, :outcome => nil, :updated_at.gt => (DateTime.now - TIMEOUT))

    new_player = Player.new(opts)
    throw "Could not save player" unless new_player.save

    if (nil != waiting_player)
      new_player.opponent = waiting_player.id
      waiting_player.opponent = new_player.id

      throw "Could not update player" unless new_player.save
      throw "Could not update opponent" unless waiting_player.save
    end

    response['Location'] = new_player.url
    response.status = 201
  end
end

def opponent_outcome(outcome)
  { 
    "lost" => "win",
    "win" => "lost",
    "timeout" => "timeout" 
  }[outcome]
end

# update a player
put '/players/:id' do
  opts = read_request(Player)

  within_transaction do
    player = Player.get(params[:id]) rescue nil
    throw "Cannot update a non existing player" if player.nil?

    player.board_string = opts[:board_string]
    player.score = opts[:score]

    if (player.outcome.nil? && ["lost","timeout"].include?(opts[:outcome]))
      player.outcome = opts[:outcome]
      opponent = Player.get(player.opponent)
      if !opponent.nil?
        opponent.outcome = opponent_outcome(player.outcome)
        throw "Could not update opponent" unless opponent.save
      end
    end

    throw "Could not update player" unless player.save

    response['Content-Type'] = 'application/json'
    { 'content' => player }.to_json
  end
end

