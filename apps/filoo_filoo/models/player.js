// Copyright (c) 2008-2010  Philippe Bourgau

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

/** @class
  (Document your class here)
*/
FilooFiloo.Player = SC.Record.extend(
/** @scope FilooFiloo.Player.prototype */ {

  name: SC.Record.attr(String),
  opponent: SC.Record.toOne("FilooFiloo.Player", {inverse: "opponent", isMaster: YES}),
  boardString: SC.Record.attr(String),
  score: SC.Record.attr(Number),
  outcome: SC.Record.attr(String)
});

// Outcomes of the game for a player. Let's
// use undefined or null for not yet unknown
FilooFiloo.Player.WIN = "win";
FilooFiloo.Player.LOST = "lost";

