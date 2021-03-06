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

require 'fileutils'

ENV['DATABASE_URL'] = "sqlite3://memory:"

require 'filoo_filoo'
require 'test/unit'
require 'rack/test'
require 'json'
require 'monitor'

set :environment, :test

module FilooFilooTestMethods
  include Rack::Test::Methods

  def setup
    DataMapper.auto_upgrade!
    self.teardown
  end

  def teardown
    # assertions here are ignored
    DataMapper.repository(:default).adapter.execute('DELETE from players') rescue nil
    DataMapper.repository(:default).adapter.execute('DELETE from high_scores') rescue nil
  end

  def test_instances_via_json_roundtrip(klass, fixtures)
    fixtures.each do |attributes|
      converted = klass.parse_json(klass.new(attributes).to_json)
      attributes.each { |key, value| assert_equal value, converted[key] }
    end
  end
  def test_json_via_instances_roundtrip(klass, jsons)
    jsons.each do |json|
      converted = JSON.parse(klass.new(klass.parse_json(json.to_json)).to_json)
      json.each { |key, value| assert_equal value, converted[key] }
    end
  end

  def app
    Sinatra::Application
  end

  def test_post(url, body, location_regex)
    post url, body.to_json()
    assert_equal 201, last_response.status
    assert last_response.headers.has_key?("Location")
    location = last_response.headers["Location"]
    assert location =~ location_regex
    location
  end

  def test_get(url, params = {})
    get url
    assert last_response.ok?
    body = JSON.parse(last_response.body)
    assert body["content"]
    result = body["content"]
    params.each do |key, value|
      assert_equal value, result[key]
    end
    result.delete("guid")
    result
  end

  def test_put(url, json, params = {})
    params.each do |key, value|
      json[key] = value
    end
    put url, json.to_json
  end

end

class HighScoreTest  < Test::Unit::TestCase
  include FilooFilooTestMethods

  def test_ruby_to_json_to_ruby_should_look_alike
    test_instances_via_json_roundtrip(HighScore,
                                      [{:player_name => "Philou", :score => 666},
                                       {:player_name => "AC", :score => 123}])
  end

  def test_all_scores_should_have_a_content
    test_get '/high_scores'
  end

  def test_posting_a_score_should_ok
    get '/high_scores'
    assert_equal 0, JSON.parse(last_response.body)["content"].length

    test_post '/high_scores', {"playerName"=>"Philou","score"=>7}, /\/high_scores\/[0-9]+/
  end

  def test_a_posted_scores_should_appear_in_all_scores
    get '/high_scores'
    scoresCount = JSON.parse(last_response.body)["content"].length

    post '/high_scores', { "playerName"=> "AC", "score"=>666 }.to_json()
    post '/high_scores', { "playerName"=> "DC", "score"=>667 }.to_json()

    get '/high_scores'
    assert_equal scoresCount + 2, JSON.parse(last_response.body)["content"].length
  end

end

class PlayerTest < Test::Unit::TestCase
  include FilooFilooTestMethods
  include MonitorMixin

  def test_url_2_id
    assert_equal nil, Player.url2id(nil)
    assert_equal 2, Player.url2id("/players/2")
    assert_equal 1, Player.url2id("/players/1")
    assert_raise RuntimeError do
      Player.url2id("invalid player url") 
    end
  end

  def test_id_2_url
    assert_equal nil, Player.id2url(nil)
    assert_equal "/players/2", Player.id2url(2)
  end

  def test_json_should_parse_without_errors
    assert Player.parse_json("{\"outcome\":null,\"name\":\"File électrique\",\"guid\":\"/players/8\",\"boardString\":\"  gr  \\n      \\n      \\n      \\n      \\n      \\n      \\n      \\n      \\n  yg  \\n gyr \\ngyryp \\n\",\"score\":540,\"opponent\":\"/players/7\"}")
    assert Player.parse_json("{\"name\":\"test\"}")
  end

  def test_ruby_to_json_to_ruby_should_look_alike
    test_instances_via_json_roundtrip(Player,
                                      [{:name => "Philou",},
                                       {:name => "AC", :opponent => 2, :board_string => " br " },
                                       {:name => "DC", :opponent => 2, :board_string => " rp ", :outcome => "win" },
                                       {:name => "DC", :opponent => 2, :board_string => " rp ", :score => 667 }])
  end
  def test_json_to_ruby_to_json_should_look_alike
    test_json_via_instances_roundtrip(Player,
                                      [{"name"=>"benyb", "opponent"=>nil, "boardString"=>nil, "outcome"=>nil },
                                       {"name"=>"benyb", "opponent"=>nil, "boardString"=>nil, "outcome"=>"lost" },
                                       {"name"=>"benyb", "opponent"=>nil, "boardString"=>nil, "outcome"=>"lost", "score"=>234 }])
  end


  def test_all_players_should_have_a_content
    test_get '/players'
  end

  def test_create_player(name="Philou")
    test_post '/players', {"name"=> name}, /\/players\/[0-9]+/
  end

  def test_create_and_get_player(name="AC", params={})
    location = test_create_player(name)
    player_json = test_get location, params.merge("guid" => location, "name" => name)

    [player_json, location]
  end

  def test_put_player_should_ok
    benyb, url = test_create_and_get_player("benyb")
    put url, benyb.to_json
    assert last_response.ok?
  end

  def test_a_lonely_player_should_not_get_an_opponent
    player_json, = test_create_and_get_player("Donald")
    assert player_json["opponent"].nil?
  end

  def test_two_players_should_play_against_each_other
    bonnyUrl = test_create_player("Bonny")
    clide, clideUrl = test_create_and_get_player "Clide", "opponent" => bonnyUrl
    bonny = test_get bonnyUrl, "opponent" => clideUrl
  end

  def test_the_last_to_loose_should_be_the_winner
    mickey, mickeyUrl = test_create_and_get_player("Mickey")
    mimieUrl = test_create_player("Mimie")

    test_put mickeyUrl, mickey, "outcome" => "lost"

    mickey = test_get mickeyUrl, "outcome" => "lost"
    mimie = test_get mimieUrl, "outcome" => "win"
  end
  
  def assert_update(name, property, old_value, new_value)
    player, url = test_create_and_get_player name, property => old_value

    test_put url, player, property => new_value

    player2 = test_get url, property => new_value
  end

  def test_grid_of_a_player_should_be_updatable
    assert_update("Goofy", "boardString", nil, " rb ")
  end

  def test_score_of_a_player_should_be_updatable
    assert_update("Pluto", "score", nil, 1234)
  end

  def test_when_many_players_login_at_the_same_time_each_one_should_get_a_unique_opponent
    players_count = 2*10
    urls = []
    threads = Array.new(players_count) do |i|
      url = test_create_player("Player_"+i.to_s)
      synchronize do
        urls << url
      end
    end
    threads.each {|thread| thread.join }

    opponents = Hash.new(0)
    assert_equal players_count, urls.length
    urls.each do |url|
      player = test_get url
      opponent = player["opponent"]
      assert !opponent.nil?, player["name"]+" should have an opponent"
      assert_equal 0, opponents[opponent], "opponent #"+opponent+" already has an opponent"
      opponents[opponent] = opponents[opponent]+1
    end

  end

  def test_incorrect_data_should_return_an_error
    DataMapper.repository(:default).adapter.execute('DROP table players')
    post "/players", {"name"=> "Regis"}.to_json
    assert_equal 500, last_response.status
  end

  def test_invalid_json_should_return_an_error
    post "/players", {"name"=> nil}.to_json
    assert_equal 401, last_response.status
  end

  def update_updated_at(playerId, timeString)
    DataMapper.repository(:default).adapter.execute("update players set updated_at = '#{timeString}' where id = #{playerId.to_s}")
  end

  def test_a_game_should_not_start_against_a_long_gone_opponent
    opponentId = Player.url2id(test_create_player("Old opponent"))
    update_updated_at(opponentId, '2010-05-12 05:11:02')
    player, = test_create_and_get_player "Late player", "opponent" => nil
  end

  def test_timeout_for_searching_an_opponent_should_be_30_seconds
    playerUrl = test_create_player("Lonely")
    update_updated_at(Player.url2id(playerUrl), '2010-05-12 05:11:02')
    player = test_get playerUrl, "outcome" => "timeout"
  end

  def test_a_game_should_end_when_one_player_timeouts
    opponentUrl = test_create_player("BusyOpponent")
    playerUrl = test_create_player("Player")

    update_updated_at(Player.url2id(opponentUrl), '2010-05-12 05:11:02')

    opponent = test_get opponentUrl, "outcome" => "timeout"
    player = test_get playerUrl, "outcome" => "timeout"
  end

  def test_when_a_player_explicitly_timeouts_then_its_outcome_should_stick_to_timeout
    assert_update("A player", "outcome", nil, "timeout")
  end

  def test_given_a_timeouted_waiting_player_when_an_opponent_starts_waiting_then_no_game_should_start
    assert_update("A player", "outcome", nil, "timeout")
    opponent, = test_create_and_get_player "An opponent", "opponent" => nil
  end

  def test_given_a_started_game_when_a_player_explicitly_timeouts_then_its_opponent_should_timeout_too
    opponentUrl = test_create_player("An opponent")
    assert_update("A player", "outcome", nil, "timeout")
    opponent = test_get opponentUrl, "outcome" => "timeout"
  end

  def test_once_a_game_is_ended_the_outcome_should_not_be_modifiable
    mickey, mickeyUrl = test_create_and_get_player("Mickey")
    mimieUrl = test_create_player("Mimie")

    test_put mickeyUrl, mickey, "outcome" => "timeout"
    test_put mickeyUrl, mickey, "outcome" => "lost"

    mickey = test_get mickeyUrl, "outcome" => "timeout"
  end

end

