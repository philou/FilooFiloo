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
      Time of the last change in the board.
      @type {Date}
    */
    time: null,

    /**
      Time of the last gameover.
      @type {Date}
    */
    gameOver: null,

    /**
      Number of pieces disappeared since the start of the game.
      @type {int}
    */
    disappearedPieces: 0,

    /**
      Starts the game.
    */
    start: function(blockedPieces) {
        blockedPieces = blockedPieces || PuyoPuyo.CoordMap.create();
        this.set('disappearedPieces', 0);
	this.set('playing', true);
	this.ticker.start(this);
	this.setBlockedPieces_(blockedPieces);
	this.setCurrentPiece_(null);

        this.onNextTick = "initCurrentPiece_";
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
	if (this.blockedPieces) {
	    var result = this.blockedPieces.getAt(col, row);
	    if (result)
		return result;
	}
	return PuyoPuyo.Game.Clear;
    },

    /**
      Invoked by the ticker to bring the piece down.
    */
    tick: function() {
        PuyoPuyo.assert(this[this.onNextTick]);

        this.onNextTick = this[this.onNextTick]();

        PuyoPuyo.assert(!this.onNextTick || this[this.onNextTick]);
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

    /**
      Moves the current piece around its center, counterclockwise.
    */
    rotate: function() {
	this.moveCurrentPiece_("rotate");
    },

    /**
      Moves the current piece around its center, clockwise.
    */
    antiRotate: function() {
	this.moveCurrentPiece_("antiRotate");
    },

    /**
      Drops the current piece to the bottom.
    */
    drop: function() {
	if (this.currentPiece) {
	    this.onNextTick = this.blockCurrentPiece_();
	}
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
    gameOver_: function() {
        this.abort();
        this.set('gameOver', this.now_());
    },
    initCurrentPiece_: function(center) {
        center = center || PuyoPuyo.Board.PieceStartOrigin;
        var newPiece = PuyoPuyo.Piece.create({
	    center: center,
	    colors: {first: this.colorProvider.popFirstColor(), second: this.colorProvider.popSecondColor()}
	});

        if (!this.pieceIsAllowed_(newPiece)) {
            this.gameOver_();
            return null;
        }

	this.setCurrentPiece_(newPiece);
        return "tickCurrentPiece_";
    },
    tickCurrentPiece_: function() {
        PuyoPuyo.assert(this.currentPiece);

	if (!this.moveCurrentPiece_("down")){
	    return this.blockCurrentPiece_();
	}
        return "tickCurrentPiece_";
    },
    setCurrentPiece_: function(newPiece) {
	this.currentPiece = newPiece;
	this.notifyChanged_();
    },
    cellIsAllowed_: function(row, col) {
	return (0 <= row) && (row <= PuyoPuyo.Board.MaxRow) &&
	       (0 <= col) && (col <= PuyoPuyo.Board.MaxCol) &&
	       !this.blockedPieces.getAt(col, row);
    },
    pieceIsAllowed_: function(piece) {
	var result = true;
	var that = this;
	piece.forEach(function(row, col) {
	    result &= that.cellIsAllowed_(row, col);
	});
	return result;
    },
    blockCurrentPiece_: function() {
	var that = this;
	this.currentPiece.forEach(function(row, col, color) {
            that.dropCell_(row, col, color);
	});
	this.setCurrentPiece_(null);
        return "cleanBlockedPieces_";
    },
    dropCell_: function(row, col, color) {
	while (this.cellIsAllowed_(row + 1, col)) {
	    row = row + 1;
	}
	this.blockedPieces.put(col, row, color);
    },
    setBlockedPieces_: function(blockedPieces) {
	this.blockedPieces = blockedPieces;
    },
    cleanBlockedPieces_: function() {
        var cleanedPieces = false;
        for(var r = PuyoPuyo.Board.MaxRow; 0 <= r; --r) {
            for(var c = 0; c <= PuyoPuyo.Board.MaxCol; ++c) {
                var piece = this.blockedPieces.pieceContaining(c, r);
                if (4 <= piece.get('count')) {
                    this.set('disappearedPieces', this.get('disappearedPieces') + piece.get('count'));
                    this.blockedPieces.removeEach(piece);
                    cleanedPieces = true;
                }
            }
        }
        if (cleanedPieces) {
            this.notifyChanged_();
            return "collapseBlockedPieces_";
        }

        return this.initCurrentPiece_();
    },
    collapseBlockedPieces_: function() {
        var collapsedPieces = false;
        for(var r = PuyoPuyo.Board.MaxRow; 0 <= r; --r) {
            for(var c = 0; c <= PuyoPuyo.Board.MaxCol; ++c) {
                if (this.blockedPieces.getAt(c,r) && this.cellIsAllowed_(r+1, c)) {
                    var color = this.blockedPieces.getAt(c,r);
                    this.blockedPieces.remove(c,r);
                    this.dropCell_(r, c, color);
                    collapsedPieces = true;
                }
            }
        }
        if (collapsedPieces) {
            this.notifyChanged_();
            return "cleanBlockedPieces_";
        }

        return this.initCurrentPiece_();
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


