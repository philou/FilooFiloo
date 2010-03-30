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
// Project:   FilooFiloo.ReadOnlyBoard
// ==========================================================================

/*globals FilooFiloo */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
FilooFiloo.ReadOnlyBoard = SC.Record.extend(
/** @scope FilooFiloo.ReadOnlyBoard.prototype */ {

  time: null,

  boardString: "",

  playing: NO,

  cells: null,

  boardStringObserver: function() {
    this.set('time', new Date());
    this.cells = this.computeCells(this.get('boardString'));
  }.observes('boardString'),

  cellState: function(col, row) {
    if (!this.cells)
      return FilooFiloo.Game.Clear;

    return this.cells[row][col];
  },

  computeCells: function(boardString) {
    if (!boardString)
      return null;

    var result = [];
    var strings = boardString.split('\n');
    for (var i = 0; i < strings.length; i++) {
      var string = strings[i];
      var row = [];
      for (var j = 0; j < string.length; j++) {
	row.push(FilooFiloo.Game.initialToState[string.charAt(j)]);
      }
      result.push(row);
    }
    return result;
  }

});
