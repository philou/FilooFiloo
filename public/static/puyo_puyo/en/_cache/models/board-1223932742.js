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
	this.setBlockedPieces_(PuyoPuyo.CoordMap.create());
	this.setCurrentPiece_(null);
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
	    var result = this.currentPiece.cellState(col, row);
	    if (result)
		return result;
	}
	// TODO changer tout cela par une expression bool�enne bien ficel�e,
	// utiliser un set plut�t qu'une piece.
	if (this.blockedPiece) {
	    var result = this.blockedPieces.get(col, row);
	    if (result)
		return result;
	}

	return PuyoPuyo.Game.Clear;
    },

    /**
      Invoked by the ticker to bring the piece down.
    */
    tick: function() {
	if (!this.currentPiece) {
	    this.initCurrentPiece_(PuyoPuyo.Board.PieceStartOrigin);
	}
	else if (!this.moveCurrentPiece_("down")){
	    this.blockCurrentPiece_();
	    this.setCurrentPiece_(null);
	}
    },

    /**
      Moves the current piece to the left.
    */
    left: function() {
	this.moveCurrentPiece_("left");
    },

    /**
      Moves the current piece to the right.
    */
    right: function() {
	this.moveCurrentPiece_("right");
    },
    
    moveCurrentPiece_: function(move) {
	if (this.currentPiece) {
	    var newPiece = this.currentPiece[move]();
	    if (this.pieceIsAllowed_(newPiece)) {
		this.setCurrentPiece_( newPiece);
		return true;
	    }
	}
	return false;
    },	

    notifyChanged_: function() {
	this.set('time', this.now_());
    },
    now_: function() {
	return new Date();
    },
    initCurrentPiece_: function(center) {
	this.setCurrentPiece_(PuyoPuyo.Piece.create({
	    center: center,
	    colors: {first: this.colorProvider.popFirstColor(), second: this.colorProvider.popSecondColor()}
	}));
    },
    setCurrentPiece_: function(newPiece) {
	this.currentPiece = newPiece;
	this.notifyChanged_();
    },
    pieceIsAllowed_: function(piece) {
	var result = true;
	piece.forEach(function(row, col) {
	    result &=
		(0 <= row) && (row <= PuyoPuyo.Board.MaxRow) &&
		(0 <= col) && (col <= PuyoPuyo.Board.MaxCol);
	});
	return result;
    },
    blockCurrentPiece_: function() {
	var that = this;
	this.currentPiece.forEach(function(row, col, color) {
	    that.blockedPieces.put(col, row, color);
	});
    },
    setBlockedPieces_: function(blockedPieces) {
	this.blockedPieces = blockedPieces;
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

