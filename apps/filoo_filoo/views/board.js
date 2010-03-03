// ==========================================================================
// Project:   FilooFiloo - mainPage
// Copyright: ©2008-2010 Philippe Bourgau, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.
//
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.
//
// You should have received a copy of the MIT License along with this
// program. If not, see <http://www.opensource.org/licenses/mit-license.php>
//
// ==========================================================================
/*globals FilooFiloo */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
FilooFiloo.BoardView = SC.View.extend({
/** @scope FilooFiloo.BoardView.prototype */

  classNames: ['board-view'],

  board: null,

  displayProperties: ['board'],

  acceptsFirstResponder: YES,

  render: function(context, firstTime)
  {
    var cellClass = function() { return ""; };
    var row = 0;
    var col = 0;
    var board = this.get('board');

    if (board) {
      cellClass = function(row, col) {
	return FilooFiloo.Game.stateToName[board.cellState(col, row)];
      };
    }

    context = context.begin('table').addClass("board-view-table");
    for (row = 0; row < FilooFiloo.Board.RowCount; row++) {

      context = context.begin('tr');

      for (col = 0; col < FilooFiloo.Board.ColCount; col++) {

	context = context.begin('td').addClass(cellClass(row,col)).end();
      }
      context = context.end();
    }
    context = context.end();

    sc_super();
  },

  /** Intercept key strokes when the game is playing. */
  focus: function() {
    var board = this.get('board');
    if(board && board.get('playing')) {
      this.becomeFirstResponder();
    } else {
      this.resignFirstResponder();
    }
  }.observes('board', '.board.playing'),

  // key handling methods
  // TODO: debug and ensure that it works
  keyDown: function(evt) {
    return this.interpretKeyEvents(evt) ;
  },
  moveRight: function(sender, evt) {
    this.get('board').right();
    return true;
  },
  moveLeft: function(sender, evt) {
    this.get('board').left();
    return true;
  },
  moveUp: function(sender, evt) {
    this.get('board').rotate();
    return true;
  },
  moveDown: function(sender, evt) {
    this.get('board').antiRotate();
    return true;
  },
  insertText: function(chr) {
    if (" " === chr) {
      this.get('board').drop();
      return true;
    }
    return false;
  }

});
