#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'
require 'dm-core'
require 'json'

# connect DataMapper to a local sqlite file. 
DataMapper.setup(:default, ENV['DATABASE_URL'] || 
    "sqlite3://#{File.join(File.dirname(__FILE__), 'tmp', 'filoo_filoo.db')}")

# Model objects that will be used to store data in the server.
# "id" will be used as the GUID.
class HighScore
  include DataMapper::Resource

  property :id, Serial
  property :player_name, Text, :required => true
  property :score, Integer, :required => true

  # helper method returns the URL for a high_score based on id  
  def url
    "/high_scores/#{self.id}"
  end

  # helper method that converts to json.
  def to_json(*a)
    {
      'guid'       => self.url, 
      'playerName' => self.player_name,
      'score'      => self.score 
    }.to_json(*a)
  end

  # keys that MUST be found in the json
  REQUIRED = [:player_name, :score]

  # ensure json is safe.  If invalid json is received returns nil
  def self.parse_json(body)
    json = JSON.parse(body)
    ret = { :player_name => json['playerName'], :score => json['score'] }
    return nil if REQUIRED.find { |r| ret[r].nil? }
    ret
  end

end

# instructs DataMapper to setup your database as needed
DataMapper.auto_upgrade!

# return list of all high scores.
get '/high_scores' do
  content_type 'application/json'
  { 'content' => Array(HighScore.all) }.to_json
end

# create a new high score. Request body to contain json
post '/high_scores' do
  opts = HighScore.parse_json(request.body.read) rescue nil
  halt(401, 'Invalid Format') if opts.nil?

  score = HighScore.new(opts)
  halt(500, 'Could not save high score') unless score.save

  response['Location'] = score.url
  response.status = 201
end
