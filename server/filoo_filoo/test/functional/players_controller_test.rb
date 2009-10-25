# Copyright (c) 2008-2009  Philippe Bourgau

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.

# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.

# You should have received a copy of the GNU Affero General Public License
# program.  If not, see <http://www.gnu.org/licenses/>

require 'test_helper'

class PlayersControllerTest < ActionController::TestCase

  def test_routes
    assert_routing "/sc/players/create", {:controller => "players", :action => "create"}
  end

  def test_create_1_player
    x = create_player("X")
    verify_player_opponent(x, nil)
  end

  def test_create_2_players
    x = create_player("X")
    verify_player_opponent(x, nil)

    y = create_player("Y")
    verify_player_opponent(x, "Y")
    verify_player_opponent(y, "X")
  end

  def test_update_player
    x = create_player("X")
    verify_player(x, "board_string", nil)

    x = post_player(:update, {:name => x["name"], :id => x["id"], :board_string => "bobo"})
    verify_player(x, "board_string", "bobo")
  end
  
private

  def create_player(player_name)
    return post_player(:create, {:name => player_name})
  end

  def post_player(action, player)
    post(action, {
           :path_prefix => "sc",
           :records => {
             0 => player}})
    assert_response :success

    fresh_players = JSON.parse(@response.body)
    return fresh_players[0]
  end

  def verify_player_opponent(player, opponent_name)
    verify_player(player, "opponent_name", opponent_name)
  end

  def verify_player(player, key, value)
    fresh_player = get_player(player["id"])
    assert_equal(value, fresh_player[key])
  end

  def get_player(player_id)
    get(:show, {:path_prefix => "sc", :id => player_id})
    assert_response :success

    players = JSON.parse(@response.body)
    assert_equal(1, players.length)
    assert_equal(player_id, players[0]["id"])
    assert_equal("player", players[0]["type"])
    return players[0]
  end

end
