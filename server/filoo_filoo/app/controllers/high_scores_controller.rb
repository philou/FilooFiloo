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

class HighScoresController < ApplicationController
  protect_from_forgery :only => [:foo]

  def list
    respond_to do |wants|
      wants.js do
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
      end
    end
  end

  # needs testing ... 
  def create
    respond_to do |wants|
      wants.json do
        if validate_player_names(params)
          create_records(params)
        end
      end
    end
  end

private

  def validate_player_names(params)
    result = true
    response = []
    params[:records].each_value do |record|
      if not record[:player_name] =~ /\A[\d\s\w_\-]*\z/
        result = false
        record[:error] = "Invalid player name"
        response << record;
      end
    end
    if not result
      render :text => response.to_json, :status => 500
    end
    return result
  end

  def create_records(params)
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
