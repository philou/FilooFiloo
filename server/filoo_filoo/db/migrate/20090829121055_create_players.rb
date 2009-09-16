# Copyright (c) 2008-2009  Philippe Bourgau

# This program is free software: you can redistribute it and/or modify
# it under the terms of the MIT License.

# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
# License for more details.

# You should have received a copy of the MIT License along with this
# program.  If not, see <http://www.opensource.org/licenses/mit-license.php>

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
