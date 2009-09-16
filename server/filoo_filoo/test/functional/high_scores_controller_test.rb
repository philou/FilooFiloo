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
require 'json'

class HighScoresControllerTest < ActionController::TestCase

  def test_routes
    assert_routing "/sc/high_scores/list", {:controller => "high_scores", :action => "list"}
  end

  def test_list
    get(:list, {:path_prefix => "sc", :order => "-score"})
    assert_response :success
    scores = JSON.parse(@response.body)
    assert_equal( 3, scores["records"].length)
    sorted_scores = scores["records"].sort {|x,y| -(x["score"] <=> y["score"]) }
    assert_equal( sorted_scores, scores["records"])
  end

  def test_create_valid
    post(:create, {
           :path_prefix => "sc", 
           :records => { 
             1 => {:player_name => "Philou", :score => 666 }}})
    assert_response :success
  end

  def test_create_invalid
    post(:create, {
          :path_prefix => "sc", 
          :records => { 
            1 => {:player_name => "'""; DROP TABLE TOTO;", :score => 666 }}})
    assert_response 500
  end

end
