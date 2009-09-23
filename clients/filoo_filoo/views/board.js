// Copyright (c) 2008-2009  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.

// You should have received a copy of the MIT License along with this
// program.  If not, see <http://www.opensource.org/licenses/mit-license.php>


// ==========================================================================
// FilooFiloo.BoardView
// ==========================================================================

require('core');
require('models/board');

/** @class

  View for a player's grid board

  @extends SC.View
  @author Philou
  @version 0.1
*/
FilooFiloo.BoardView = SC.View.extend(function() {
    /** @scope FilooFiloo.BoardView.prototype */

    var renderHtml = function(elemValues) {
	var html = [];
        var row = 0;
        var col = 0;

	for (row = 0; row < FilooFiloo.Board.RowCount; row++) {

	    html.push('<tr>');

	    for (col = 0; col < FilooFiloo.Board.ColCount; col++) {

		html.push('<td class="');
		html.push(elemValues(row, col));
		html.push('"/>');
	    }
	    html.push('</tr>');
	}

	return html.join('');
    };

    return {

	board: null,

	acceptsFirstResponder: true,

	emptyElement: '<table>' + renderHtml(function(_row, _col) { return false; }) + '</table>',

	render: function() {
	  var board = this.get('board');
	  this.set('innerHTML', renderHtml( function(row, col) {
	    return FilooFiloo.Game.stateToName[board.cellState(col, row)];
	  }));
	}.observes('board', '.board.time'),

        focus: function() {
	  var board = this.get('board');
          if(board && board.get('playing')) {
            this.becomeFirstResponder();
          } else {
            this.resignFirstResponder();
          }
        }.observes('board', '.board.playing'),

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
    };
}()) ;
