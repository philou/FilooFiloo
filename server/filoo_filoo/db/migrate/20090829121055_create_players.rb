class CreatePlayers < ActiveRecord::Migration
  def self.up
    create_table :players do |t|
      t.column :name, :string
      t.column :opponent_name, :string
      t.column :lock_version, :int
      t.timestamps
    end
  end

  def self.down
    drop_table :players
  end
end
