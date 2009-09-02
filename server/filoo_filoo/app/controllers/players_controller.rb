
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
      :type => "player"}
  end

end
