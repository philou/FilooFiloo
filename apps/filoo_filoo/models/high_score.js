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
// FilooFiloo.HighScore
// ==========================================================================

/** @class
  (Document your class here)
*/
FilooFiloo.HighScore = SC.Record.extend(
/** @scope FilooFiloo.HighScore.prototype */ {

  playerName: SC.Record.attr(String),
  score: SC.Record.attr(Number),

  summary: function() {
    return this.get('playerName')+': '+this.get('score');
  }.property('playerName','score'),

  ranking: function() {
    return -this.get('score');
  }.property('score')

}) ;
