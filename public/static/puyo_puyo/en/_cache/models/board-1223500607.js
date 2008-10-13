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
	return
	    (this.currentPiece && this.currentPiece.cellState(col, row)) ||
	    (this.blockedPiece && this.blockedPiece.cellState(col, row)) ||
	    PuyoPuyo.Game.Clear;
    },

    /**
      Invoked by the ticker to bring the piece down.
    */
    tick: function() {
	// comment tester si on est en bas ?
	// faire une fonction each dans piece, tester chaque coordonnée.
	if (!this.currentPiece) {
	    this.initCurrentPiece_(PuyoPuyo.Board.PieceStartOrigin);
	}
	else {
	    var newPiece = this.currentPiece.moveDown();
	    if (this.pieceIsAllowed_(newPiece)) {
		this.currentPiece = newPiece;
	    }
	    else {
		this.blockCurrentPiece_();
		this.currentPiece = null;
	    }
	}
	this.notifyChanged_();
    },

    notifyChanged_: function() {
	this.set('time', this.now_());
    },
    now_: function() {
	return new Date();
    },
    initCurrentPiece_: function(center) {
	this.currentPiece = PuyoPuyo.Piece.create({
	    center: center,
	    colors: {first: this.colorProvider.popFirstColor(), second: this.colorProvider.popSecondColor()}
	});
    },
    pieceIsAllowed_: function(piece) {
	var result = true;
	piece.forEach(function(row, col) {
	    result &=
		(0 < row) && (row < PuyoPuyo.Board.MaxRow) &&
		(0 < col) && (col < PuyoPuyo.Board.MaxCol);
	});
	return result;
    },
    blockCurrentPiece_: function() {
	this.blockedPiece = this.currentPiece;
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

