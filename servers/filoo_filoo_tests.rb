#!/usr/bin/env ruby

require 'filoo_filoo'
require 'test/unit'
require 'rack/test'

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

  # TODO install rack_test gem for this to work

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
    post '/high_scores/1', '{ "id":1, "playerName": "Philou", "score":007 }' # should we add a guid to the request body ?
    assert last_response.ok?
    # TODO test for the location inside the respone -> how to find the response["Location"] set in the server ?
  end

  def test_a_posted_scores_should_appear_in_all_scores
    get '/high_scores'
    assert JSON.parse(last_response.body)["content"].empty

    post '/high_scores/2', '{ "id": 2, "playerName": "AC", "score":666 }' # should we add a guid to the request body ?
    post '/high_scores/3', '{ "id": 3, "playerName": "DC", "score":667 }' # should we add a guid to the request body ?

    get '/high_scores'
    assert_equal 2 JSON.parse(last_response.body)["content"].length
  end

end
