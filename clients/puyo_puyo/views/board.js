// ==========================================================================
// PuyoPuyo.BoardView
// ==========================================================================

require('core');
require('models/board');

/** @class

  View for a player's grid board

  @extends SC.View
  @author Philou
  @version 0.1
*/
PuyoPuyo.BoardView = SC.View.extend(function() {
    /** @scope PuyoPuyo.BoardView.prototype */

    var renderHtml = function(elemValues) {
	var html = [];
        var row = 0;
        var col = 0;

	for (row = 0; row < PuyoPuyo.Board.RowCount; row++) {

	    html.push('<tr>');
	    
	    for (col = 0; col < PuyoPuyo.Board.ColCount; col++) {

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

	boardTime: null,
        playing: false,
	acceptsFirstResponder: true,

	emptyElement: '<table>' + renderHtml(function(_row, _col) { return false; }) + '</table>',

	render: function() {
	    var board = this.get('board');
	    this.set('innerHTML', renderHtml( function(row, col) {
		return PuyoPuyo.Game.stateToName[board.cellState(col, row)];
	    }));
	}.observes('boardTime', 'board'),

        focus: function() {
            if(this.get('playing')) {
                this.becomeFirstResponder();
            } else {
                this.resignFirstResponder();
            }
        }.observes('playing', 'board'),

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
