// Copyright (c) 2008-2010  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.

// You should have received a copy of the MIT License along with this
// program.  If not, see <http://www.opensource.org/licenses/mit-license.php>


// ==========================================================================
// FilooFiloo.Player
// ==========================================================================

/** @class

  (Document your class here)

  @extends SC.Record
  @author AuthorName
  @version 0.1
*/
FilooFiloo.Player = SC.Record.extend(
/** @scope FilooFiloo.Player.prototype */ {

  name: SC.Record.attr(String),
  opponent: SC.Record.toOne("FilooFiloo.Player", {inverse: "opponent", isMaster: YES}),
  boardString: SC.Record.attr(String)
}) ;
