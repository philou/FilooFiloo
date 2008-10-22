/* Start ----------------------------------------------------- views/board.js*/

// ==========================================================================
// PuyoPuyo.BoardView
// ==========================================================================

require('core');

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

	for (row = 0; row < PuyoPuyo.Board.RowCount; row++) {

	    html.push('<tr>');
	    
	    for (col = 0; col < PuyoPuyo.Board.ColCount; col++) {

		html.push('<td class="game_cell ');
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
	acceptsFirstResponder: true,

	emptyElement: '<table>' + renderHtml(function(_row, _col) { return false; }) + '</table>',

	render: function() {
	    var board = this.get('board');
	    this.set('innerHTML', renderHtml( function(row, col) {
		return PuyoPuyo.Game.stateToName[board.cellState(col, row)];
	    }));
	}.observes('boardTime', 'board'),

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
	}
    };
}()) ;


/* End ------------------------------------------------------- views/board.js*/

