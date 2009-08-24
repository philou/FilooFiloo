class CreateHighScores < ActiveRecord::Migration
  def self.up
    create_table :high_scores do |t|
      t.column :player_name, :string
      t.column :score, :integer
      t.timestamps
    end
  end

  def self.down
    drop_table :high_scores
  end
end
