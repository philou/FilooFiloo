# Copyright (c) 2008-2009  Philippe Bourgau

# This program is free software: you can redistribute it and/or modify
# it under the terms of the MIT License.

# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
# License for more details.

# You should have received a copy of the MIT License along with this
# program.  If not, see <http://www.opensource.org/licenses/mit-license.php>

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

private

  def create_player(player_name)
    post(:create, {
           :path_prefix => "sc",
           :records => {
             0 => {:name => player_name}}})
    assert_response :success

    player = JSON.parse(@response.body)
    return player[0]["id"]
  end

  def verify_player_opponent(player_id, opponent_name)
    get(:show, {:path_prefix => "sc", :id => player_id})
    assert_response :success

    player = JSON.parse(@response.body)
    assert_equal(1, player.length)
    assert_equal(player_id, player[0]["id"])
    assert_equal("player", player[0]["type"])
    assert_equal(opponent_name, player[0]["opponent_name"])
  end

end
