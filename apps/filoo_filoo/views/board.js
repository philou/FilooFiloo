// ==========================================================================
// Project:   FilooFiloo - mainPage
// Copyright: ©2008-2010 Philippe Bourgau, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>
//
// ==========================================================================
/*globals FilooFiloo */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
FilooFiloo.BoardView = SC.View.extend(SC.ContentDisplay, {
/** @scope FilooFiloo.BoardView.prototype */

  classNames: ['board-view'],

  contentDisplayProperties: 'time playing'.w(),

  acceptsFirstResponder: YES,

  render: function(context, firstTime)
  {
    var board = this.get('content');

    var cellClass = function() { return ''; };
    if (board) {
      cellClass = function(row, col) {
	return FilooFiloo.Game.stateToName[board.cellState(col, row)];
      };
    }

    var renderHtml= function() {
      var result = [];
      var row = 0;
      var col = 0;

      for (row = 0; row < FilooFiloo.Board.RowCount; row++) {

	result.push('<tr>');

	for (col = 0; col < FilooFiloo.Board.ColCount; col++) {

	  result.push('<td class="');
	  result.push(cellClass(row,col));
	  result.push('" />');
	}
	result.push('</tr>');
      }
      return result.join('');

    };

    context = context.begin('table').addClass("board-view-table").push(renderHtml()).end();

    sc_super();
  },

  /** Intercept key strokes when the game is playing. */
  focus: function() {
    var board = this.get('content');
    if(board && board.get('playing')) {
      this.becomeFirstResponder();
    } else {
      this.resignFirstResponder();
    }
  }.observes('content', '.content.playing'),

  // key handling methods
  // TODO: debug and ensure that it works
  keyDown: function(evt) {
    return this.interpretKeyEvents(evt) ;
  },
  moveRight: function(sender, evt) {
    this.get('content').right();
    return true;
  },
  moveLeft: function(sender, evt) {
    this.get('content').left();
    return true;
  },
  moveUp: function(sender, evt) {
    this.get('content').rotate();
    return true;
  },
  moveDown: function(sender, evt) {
    this.get('content').antiRotate();
    return true;
  },
  insertText: function(chr) {
    if (" " === chr) {
      this.get('content').drop();
      return true;
    }
    return false;
  }

});
