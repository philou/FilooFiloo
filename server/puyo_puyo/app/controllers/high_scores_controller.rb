class HighScoresController < ApplicationController
  def list
    scores = HighScore.all(:order => params[:order])
    respond_to do |wants|
      wants.js {
        records = scores.map do |score|
          {
            :guid => score.id,
            :type => score.class.name,
            :playerName => score.player_name,
            :score => score.score
          }
        end
        render :text => { :records => records, :ids => scores.map(&:id) }.to_json
      }
    end
  end
end
