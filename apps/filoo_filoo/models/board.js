// Copyright (c) 2008-2010  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// program.  If not, see <http://www.gnu.org/licenses/>


// ==========================================================================
// FilooFiloo.Board
// ==========================================================================

require('models/game');
require('models/ticker');
require('models/color_provider');

/** @class

  Objects representing a players board.

  @extends SC.Record
  @author Philou
  @version 0.1
*/
FilooFiloo.Board = SC.Record.extend(
/** @scope FilooFiloo.Board.prototype */ {

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
      @type {int}
    */
    score: 0,

    /**
      Difficulty level reached by the player.
      #type {int}
    */
    level: function() {
        return Math.floor(this.get('disappearedPieces') / FilooFiloo.Game.LevelUpgrade) + 1;
    }.property('disappearedPieces'),

    /**
     * Ticker responsible of time.
     */
    getTicker: function() {
      if (!this.ticker) {
	this.ticker = FilooFiloo.Ticker.create();
      }
      return this.ticker;
    },

    /**
     * Random color provider.
     */
    getColorProvider: function() {
      if(!this.colorProvider) {
	this.colorProvider = FilooFiloo.ColorProvider.create();
      }
      return this.colorProvider;
    },

    /**
      Starts the game.
    */
    start: function(blockedPieces) {
        blockedPieces = blockedPieces || FilooFiloo.CoordMap.create();
        this.set('disappearedPieces', 0);
        this.set('score', 0);
	this.set('playing', true);
	this.getTicker().start(this);
	this.setBlockedPieces_(blockedPieces);
	this.setCurrentPiece_(null);

        this.onNextTick = "initCurrentPiece_";
    },

    /**
      Aborts the game.
    */
    abort: function() {
	this.getTicker().stop();
	this.set('playing', false);
    },

    /**
      Cell status for a given column and row, see FilooFiloo.Game for a list of all available states.
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
	return FilooFiloo.Game.Clear;
    },

    /**
      Invoked by the ticker to bring the piece down.
    */
    tick: function() {
        FilooFiloo.assert(this[this.onNextTick]);

        this.onNextTick = this[this.onNextTick]();

        FilooFiloo.assert(!this.onNextTick || this[this.onNextTick]);
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
        center = center || FilooFiloo.Board.PieceStartOrigin;
        var newPiece = FilooFiloo.Piece.create({
	    center: center,
	    colors: {first: this.getColorProvider().popFirstColor(), second: this.getColorProvider().popSecondColor()}
	});

        if (!this.pieceIsAllowed_(newPiece)) {
            this.gameOver_();
            return null;
        }

        this.scoreMultiplier = 1;
	this.setCurrentPiece_(newPiece);
        return "tickCurrentPiece_";
    },
    tickCurrentPiece_: function() {
        FilooFiloo.assert(this.currentPiece);

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
	return (0 <= row) && (row <= FilooFiloo.Board.MaxRow) &&
	       (0 <= col) && (col <= FilooFiloo.Board.MaxCol) &&
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
        for(var r = FilooFiloo.Board.MaxRow; 0 <= r; --r) {
            for(var c = 0; c <= FilooFiloo.Board.MaxCol; ++c) {
                var piece = this.blockedPieces.pieceContaining(c, r);
                if (4 <= piece.get('count')) {
                    this.set('disappearedPieces', this.get('disappearedPieces') + piece.get('count'));
                    this.set('score', this.get('score') + this.scoreMultiplier * piece.get('count'));
                    this.blockedPieces.removeEach(piece);
                    cleanedPieces = true;
                }
            }
        }
        if (cleanedPieces) {
            this.scoreMultiplier = FilooFiloo.Game.CascadeScoreMultiplier * this.scoreMultiplier;
            this.notifyChanged_();
            return "collapseBlockedPieces_";
        }

        return this.initCurrentPiece_();
    },
    collapseBlockedPieces_: function() {
        var collapsedPieces = false;
        for(var r = FilooFiloo.Board.MaxRow; 0 <= r; --r) {
            for(var c = 0; c <= FilooFiloo.Board.MaxCol; ++c) {
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
    },

    forwardLevelToTheTicker: function() {
      this.getTicker().setLevel(this.get('level'));
    }.observes('level')
});

FilooFiloo.Board.setDimensions = function(colCount, rowCount) {
    this.ColCount = colCount;
    this.MaxCol = colCount - 1;

    this.RowCount = rowCount;
    this.MaxRow = rowCount - 1;

    this.PieceStartOrigin = {row: 0, col: this.ColCount / 2 - 1 };
};

FilooFiloo.Board.setDimensions(FilooFiloo.Game.ColCount, FilooFiloo.Game.RowCount);

FilooFiloo.Board.boardToString = function(board) {
  result = [];
  for (row = 0; row < FilooFiloo.Board.RowCount; row++) {
    for (col = 0; col < FilooFiloo.Board.ColCount; col++) {

      result.push(FilooFiloo.Game.stateToInitial[board.cellState(col, row)]);
    }
    result.push("\n");
  }

  return result.join("");
};



