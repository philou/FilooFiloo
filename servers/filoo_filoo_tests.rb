#!/usr/bin/env ruby

require 'fileutils'

ENV['DATABASE_URL'] = "sqlite3://memory:"

require 'filoo_filoo'
require 'test/unit'
require 'rack/test'
require 'json'

set :environment, :test

module FilooFilooTestMethods
  include Rack::Test::Methods

  def setup
    @__transaction = DataMapper::Transaction.new(DataMapper.repository(:default))
    @__transaction.begin

    # FIXME: Should I really be calling #push_transaction like that, or is there a better way?
    DataMapper.repository(:default).adapter.push_transaction(@__transaction)
  end

  def teardown
    if @__transaction
      DataMapper.repository(:default).adapter.pop_transaction
      @__transaction.rollback
      @__transaction = nil
    end
  end

  def test_json_roundtrip(fixtures, klass)
    fixtures.each do |attributes|
      converted = klass.parse_json(klass.new(attributes).to_json)
      attributes.each { |key, value| assert_equal value, converted[key] }
    end
  end

  def app
    Sinatra::Application
  end

  def test_post(url, json, location_regex)
    post url, json
    assert_equal 201, last_response.status
    assert last_response.headers.has_key?("Location")
    location = last_response.headers["Location"]
    assert location =~ location_regex
    location
  end

  def test_get(url)
    get url
    assert last_response.ok?
    body = JSON.parse(last_response.body)
    assert body["content"]
    body["content"]
  end

end

class HighScoreTest  < Test::Unit::TestCase
  include FilooFilooTestMethods

  def test_ruby_to_json_to_ruby_should_look_alike
    test_json_roundtrip([{:player_name => "Philou", :score => 666},
                         {:player_name => "AC", :score => 123}], HighScore)
  end

  def test_all_scores_should_have_a_content
    test_get '/high_scores'
  end

  def test_posting_a_score_should_ok
    get '/high_scores'
    assert_equal 0, JSON.parse(last_response.body)["content"].length

    test_post '/high_scores', '{"playerName":"Philou","score":7}', /\/high_scores\/[0-9]+/
  end

  def test_a_posted_scores_should_appear_in_all_scores
    get '/high_scores'
    scoresCount = JSON.parse(last_response.body)["content"].length

    post '/high_scores', '{ "playerName": "AC", "score":666 }'
    post '/high_scores', '{ "playerName": "DC", "score":667 }'

    get '/high_scores'
    assert_equal scoresCount + 2, JSON.parse(last_response.body)["content"].length
  end

end

class PlayerTest < Test::Unit::TestCase
  include FilooFilooTestMethods

  def test_ruby_to_json_to_ruby_should_look_alike
    test_json_roundtrip([{:name => "Philou",},
                         {:name => "AC", :opponent_name => "Philou", :board_string => " br "}], Player)
  end

  def test_create_player(name="Philou")
    test_post '/players', "{\"name\": \"#{name}\"}", /\/players\/[0-9]+/
  end

  def test_create_and_get_player(name="AC")
    location = test_create_player(name)
    player_json = test_get location
    assert_equal name, player_json["name"]
    player_json
  end

  def _test_put_player_should_ok
  end

  def test_a_lonely_player_should_not_get_an_opponent
    player_json = test_create_and_get_player("Donald")
    assert player_json["opponentName"].nil?
  end

  def test_two_players_should_play_against_each_other
    bonnyUrl = test_create_player("Bonny")
    clide = test_create_and_get_player("Clide")

    assert_equal "Bonny", clide["opponentName"]
    assert_equal "Clide", (test_get bonnyUrl)["opponentName"]
  end
  
  def _test_grid_of_a_player_should_be_updatable
  end

end
