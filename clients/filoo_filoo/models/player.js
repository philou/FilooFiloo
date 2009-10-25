// Copyright (c) 2008-2009  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// program.  If not, see <http://www.gnu.org/licenses/>


// ==========================================================================
// FilooFiloo.Player
// ==========================================================================

require('core');

/** @class

  (Document your class here)

  @extends SC.Record
  @author AuthorName
  @version 0.1
*/
FilooFiloo.Player = SC.Record.extend(
/** @scope FilooFiloo.Player.prototype */ {

  dataSource: FilooFiloo.server,
  resourceURL: 'players',
  type: 'Player', // I added this for the refresh function to know the type of the incoming json record

  properties: ['name', 'opponentName', 'boardString'],
  primaryKey: 'guid'
}) ;
