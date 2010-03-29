#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'
require 'dm-core'
require 'json'

# connect DataMapper to a local sqlite file. 
DataMapper.setup(:default, ENV['DATABASE_URL'] || 
    "sqlite3://#{File.join(File.dirname(__FILE__), 'tmp', 'filoo_filoo.db')}")

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
      'boardString' => self.board_string
    }.to_json(*a)
  end

  # keys that MUST be found in the json
  REQUIRED = [:name]

  def self.parse_json(body)
    json = JSON.parse(body)
    ret = { :name => json['name'], :opponent => Player.url2id(json['opponent']), :board_string => json['boardString'] }
    return nil if REQUIRED.find { |r| ret[r].nil? }
    ret
  end

end


# upgrade your database as needed
DataMapper.auto_upgrade!

get '/high_scores' do
  content_type 'application/json'
  { 'content' => Array(HighScore.all) }.to_json
end

post '/high_scores' do
  body = request.body.read
  opts = HighScore.parse_json(body) rescue nil
  halt(401, 'Invalid Format') if opts.nil?

  score = HighScore.new(opts)
  halt(500, 'Could not save high score') unless score.save

  response['Location'] = score.url
  response.status = 201
end

get '/players/:id' do
  player = Player.get(params[:id]) rescue nil
  halt(404, 'Not Found') if player.nil?

  content_type 'application/json'
  { 'content' => player }.to_json
end

get '/players' do
  content_type 'application/json'
  { 'content' => Array(Player.all) }.to_json
end

post '/players' do
  body = request.body.read
  opts = Player.parse_json(body) rescue nil
  halt(401, 'Invalid Format') if opts.nil?

  waiting_player = Player.first(:opponent => nil)

  new_player = Player.new(opts)
  halt(500, 'Could not save player') unless new_player.save

  if (nil != waiting_player)
    new_player.update(:opponent => waiting_player.id)
    waiting_player.update(:opponent => new_player.id)

    halt(500, 'Could not update player') unless new_player.save
    halt(500, 'Could not update opponent') unless waiting_player.save
  end

  response['Location'] = new_player.url
  response.status = 201
end

put '/players/:id' do
  player = Player.get(params[:id]) rescue nil
  halt(404, 'Not Found') if player.nil?

  opts = Player.parse_json(request.body.read) rescue nil
  halt(401, 'Invalid Format') if opts.nil?

  player.board_string = opts[:board_string]
  player.save

  response['Content-Type'] = 'application/json'
  { 'content' => player }.to_json
end
