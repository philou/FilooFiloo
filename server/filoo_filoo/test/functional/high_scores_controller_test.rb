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
