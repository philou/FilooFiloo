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


class PlayersController < ApplicationController
  protect_from_forgery :only => [:foo]

  def list
    respond_to do |wants|
      wants.json do
        players = Player.all()
        records = players.map do |player|
          player2Record(player)
        end
        render :text =>  {:records => records, :ids => players.map(&:id)}.to_json
      end
    end
  end

  def create
    respond_to do |wants|
      wants.json do
        response = []
        params[:records].each_pair do |_record_id, record|
          Player.transaction do

            record.delete(:id)
            record.delete(:opponent_name)
            guid = record.delete(:_guid)
            player = Player.new(record)

            opponent = Player.find(:first, :conditions => "opponent_name is null")
            if opponent
              player.opponent_name = opponent.name
              opponent.opponent_name = player.name
              opponent.save
            end

            player.save
            response << {:_guid => guid, :id => player.id}
            #maybe we could send back the whole data ...

          end
        end
        render :text => response.to_json
      end
    end
  end

  def update
    respond_to do |wants|
      wants.json do
        response = []
        params[:records].each_pair do |_record_id, record|
          Player.transaction do

            player = Player.find(record[:id])
            player.opponent_name = record[:opponent_name]
            player.board_string = record[:board_string]
            player.save

            response << player2Record(player)
          end
        end
        render :text => response.to_json
      end
    end
  end

  def show
    respond_to do |wants|
      wants.json do
        player = Player.find(params[:id])
        record = player2Record(player)
        render :text =>  [record].to_json
      end
    end
  end

private

  def player2Record(player)
    { :id => player.id,
      :name => player.name,
      :opponent_name => player.opponent_name,
      :type => "player",
      :board_string => player.board_string}
  end

end
