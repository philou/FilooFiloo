/* Start ----------------------------------------------------- models/board.js*/

// ==========================================================================
// PuyoPuyo.Board
// ==========================================================================

require('core');
require('models/game');

/** @class

  Objects representing a players board.

  @extends SC.Record
  @author Philou
  @version 0.1
*/
PuyoPuyo.Board = SC.Record.extend(
/** @scope PuyoPuyo.Board.prototype */ {

    /**
      Is the game currently playing ?

      @type {Boolean}
    */
    playing: false,

    /**
      Starts the game.
    */
    start: function() {
	this.set('playing', true);
	this.ticker.start(this);
    },

    /**
      Aborts the game.
    */
    abort: function() {
	this.ticker.stop();
	this.set('playing', false);
    },

    /** 
      Cell status for a given column and row, see PuyoPuyo.Game for a list of all available states.
    */
    cellState: function(col, row) {
	if (this.currentPiece) {
	    return this.currentPiece.cellState(col, row);
	}

	return PuyoPuyo.Game.Clear;
    },

    /**
      Invoked by the ticker to bring the piece down.
    */
    tick: function() {
	if (!this.currentPiece) {
	    this.setCurrentPiece_(PuyoPuyo.Board.PieceStartOrigin);
	}
	else {
	    this.currentPiece.moveDown()
	}
	this.notifyChanged_();
    },

    notifyChanged_: function() {
	this.set('time', this.now_());
    },
    now_: function() {
	return new Date();
    },

    // TODO correct this to make current piece ...
    setCurrentPiece_: function(center) {
	this.currentPiece = PuyoPuyo.Piece.create({
	    center: center,
	    colors: {first: this.colorProvider.popFirstColor(), second: this.colorProvider.popSecondColor()}
	});
    }
});

PuyoPuyo.Board.setDimensions = function(colCount, rowCount) {
    this.ColCount = colCount;
    this.MaxCol = colCount - 1;

    this.RowCount = rowCount;
    this.MaxRow = rowCount - 1;

    this.PieceStartOrigin = {row: 0, col: this.ColCount / 2 - 1 };
};

PuyoPuyo.Board.setDimensions(PuyoPuyo.Game.ColCount, PuyoPuyo.Game.RowCount);




/* End ------------------------------------------------------- models/board.js*/

