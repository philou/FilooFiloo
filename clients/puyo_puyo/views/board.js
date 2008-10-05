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
		if (elemValues(row, col)) {
		    html.push('filled');
		} else {
		    html.push('blank');
		}
		html.push('"/>');
	    }
	    html.push('</tr>');
	}

	return html.join('');
    };

    return {
	
	board: null,

	emptyElement: '<table>' + renderHtml(function(_row, _col) { return false; }) + '</table>',

	render: function() {
	    this.set('innerHTML', renderHtml( function(row, col) { return false; }));
	}.observes('board')
    };
}()) ;
