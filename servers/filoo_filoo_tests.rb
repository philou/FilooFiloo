#!/usr/bin/env ruby

require 'fileutils'

# better to start from a empty test database
DB_FILE = "/tmp/filoo_filoo_tests.db"
ENV['DATABASE_URL'] = "sqlite3://#{DB_FILE}"
FileUtils.rm_f(DB_FILE)

require 'filoo_filoo'
require 'test/unit'
require 'rack/test'
require 'json'

set :environment, :test

class HighScoreTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def test_ruby_to_json_to_ruby_should_look_alike
    [{:player_name => "Philou", :score => 666},
     {:player_name => "AC", :score => 123}].each { |score|

      converted = HighScore.parse_json(HighScore.new(score).to_json)

      assert_equal score[:player_name], converted[:player_name]
      assert_equal score[:score], converted[:score]
    }
  end

  def app
    Sinatra::Application
  end

  def test_all_scores_should_have_a_content
    get '/high_scores'
    assert last_response.ok?
    scores = JSON.parse(last_response.body)
    assert scores["content"]
  end

  def test_posting_a_score_should_ok
    post '/high_scores', '{"playerName":"Philou","score":7}'
    assert_equal 201, last_response.status
    assert last_response.headers.has_key?("Location")
  end

  def test_a_posted_scores_should_appear_in_all_scores
    get '/high_scores'
    assert_equal 0, JSON.parse(last_response.body)["content"].length

    post '/high_scores', '{ "playerName": "AC", "score":666 }'
    post '/high_scores', '{ "playerName": "DC", "score":667 }'

    get '/high_scores'
    assert_equal 2, JSON.parse(last_response.body)["content"].length
  end

end
