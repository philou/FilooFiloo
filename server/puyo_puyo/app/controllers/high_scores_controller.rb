class HighScoresController < ApplicationController
  protect_from_forgery :only => [:foo]

  def list
    respond_to do |wants|
      wants.js {
        scores = HighScore.all(:order => params[:order])
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

  def create
    respond_to do |wants|
      wants.json do
        response = []
        params[:records].each_pair do |record_id, record|
          record.delete(:id)
          guid = record.delete(:_guid)
          score = HighScore.new(record)
          score.save
          response << {:_guid => guid, :id => score.id}
        end
        render :text => response.to_json
      end
    end
  end

end
