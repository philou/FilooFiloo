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
    get(:create, {
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
