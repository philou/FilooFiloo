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
FilooFiloo.ReadOnlyBoard = SC.Object.extend(
/** @scope FilooFiloo.ReadOnlyBoard.prototype */ {

  boardString: "",

  playing: NO,

  init: function() {
    sc_super();
    this.updateCells();
  },

  boardStringObserver: function() {
    this.updateCells(this.get('boardString'));
  }.observes('boardString'),

  updateCells: function(boardString) {
    if (!boardString) {
      for(var col = 0; col < FilooFiloo.Board.ColCount; col++) {
	for(var row = 0; row < FilooFiloo.Board.RowCount; row++) {
	  this.set(FilooFiloo.Board.cellProperty(col, row), FilooFiloo.Game.Clear);
	}
      }
      return;
    }

    var rows = boardString.split('\n');
    for (var iRow = 0; iRow < rows.length; iRow++) {
      var row = rows[iRow];
      for (var iCol = 0; iCol < row.length; iCol++) {
	this.setIfChanged(FilooFiloo.Board.cellProperty(iCol,iRow),
			  FilooFiloo.Game.initialToState[row.charAt(iCol)]);
      }
    }
  }

});
