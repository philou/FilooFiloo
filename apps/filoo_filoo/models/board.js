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
require('models/random');

/** @class
  Objects representing a players board.
*/
FilooFiloo.Board = SC.Object.extend(
/** @scope FilooFiloo.Board.prototype */ {

    /**
      Is the game currently playing ?
      @type {Boolean}
    */
    playing: false,

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
     * Random column picker
     */
    columnPicker: FilooFiloo.Random,

    init: function() {
      sc_super();
      for(var col = 0; col < FilooFiloo.Board.ColCount; col++) {
	for(var row = 0; row < FilooFiloo.Board.RowCount; row++) {
	  this.set(FilooFiloo.Board.cellProperty(col, row), FilooFiloo.Game.Clear);
	}
      }
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

	this.scoringPieces = 0;
	this.junkCount = 0;
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

    /**
     * Adds some junk to be given to the player before next piece ...
     */
    addJunk: function(count) {
      this.junkCount += count;
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
      for(var col = 0; col < FilooFiloo.Board.ColCount; col++) {
	for(var row = 0; row < FilooFiloo.Board.RowCount; row++) {
	  this.setIfChanged(FilooFiloo.Board.cellProperty(col, row), this.cellState(col, row));
	}
      }
    },
    now_: function() {
	return new Date();
    },
    gameOver_: function() {
        this.abort();
        this.set('gameOver', this.now_());
    },
    initCurrentPiece_: function(center) {
      var points = 10 * this.scoringPieces * (this.scoringPieces - 3);
      this.set('score', this.get('score') + points);
      this.scoringPieces = 0;

      if (0 < this.junkCount) {
	return this.dumpJunk_();
      }
      else {
	return this.createNewPiece_();
      }
    },
    dumpJunk_: function() {
      var that = this;
      var result = "createNewPiece_";
      var junkToDump = Math.min(FilooFiloo.Board.MaxJunkLoad,this.junkCount);
      var fullLines = Math.floor(junkToDump / FilooFiloo.Board.ColCount);
      var lastLineSize = junkToDump % FilooFiloo.Board.ColCount;

      var dropJunk = function(col) {
	if(!that.cellIsAllowed_(0, col)) {
	  result = null;
	  that.gameOver_();
	  return;
	}

	that.dropCell_(0,col,FilooFiloo.Game.Junk);
      };

      for(var i = 0; i < fullLines; i++) {
	for(var c = 0; c < FilooFiloo.Board.ColCount; c++) {
	  dropJunk(c);
	}
      }

      this.columnPicker.randomUniqueIntegers(lastLineSize, FilooFiloo.Board.ColCount).forEach(dropJunk);

      this.junkCount -= junkToDump;
      this.notifyChanged_();
      return result;
    },
    createNewPiece_: function() {
      var newPiece = FilooFiloo.Piece.create({
	center: FilooFiloo.Board.PieceStartOrigin,
	colors: {first: this.getColorProvider().popFirstColor(), second: this.getColorProvider().popSecondColor()}
      });

      if (!this.pieceIsAllowed_(newPiece)) {
	this.gameOver_();
	return null;
      }

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

    /** Finialize the moves of the current piece once blocked.
     *  actionColRowPredicate(c,r) should return an action to do
     *    or nothing
     *  nextFinializeStep is the finialize function to call at next
     *    tick if the finialization is not yet finished
     */
    finializeCurrentPiece: function(actionColRowPredicate, nextFinializeStep) {
      var didSomething = NO;

      for(var r = FilooFiloo.Board.MaxRow; 0 <= r; --r) {
        for(var c = 0; c <= FilooFiloo.Board.MaxCol; ++c) {

	  var action = actionColRowPredicate(c,r);
	  if(action) {
	    didSomething = YES;
	    action(c,r);
	  }
        }
      }
      if(didSomething) {
        this.notifyChanged_();
        return nextFinializeStep;
      }

      return this.initCurrentPiece_();
    },
    cleanBlockedPieces_: function() {
      var that = this;

      return this.finializeCurrentPiece(
	function(c,r) {

	  var cellState = that.cellState(c,r);
	  var piece = that.blockedPieces.pieceContaining(c,r);

	  if ((FilooFiloo.Game.Junk != cellState) && (4 <= piece.get('count'))) {
	    return function() {
	      that.set('disappearedPieces', that.get('disappearedPieces') + piece.get('count'));
              that.scoringPieces = that.scoringPieces + piece.get('count');
              that.blockedPieces.removeEach(piece);

	      that.cleanSurroundingJunk_(piece);
	    };
	  }
	  return null;
	},
	"collapseBlockedPieces_");
    },
    cleanSurroundingJunk_: function(disapearingPiece) {
      var that = this;

      disapearingPiece.surroundingPiece(YES).each(function(x, y) {
	if (FilooFiloo.Board.areValidCoordinates(x,y) && FilooFiloo.Game.Junk == that.cellState(x,y)) {
	  that.blockedPieces.remove(x,y);
	}
      });
    },
    collapseBlockedPieces_: function() {
      var that = this;

      return this.finializeCurrentPiece(
	function(c,r) {

	  if (that.blockedPieces.getAt(c,r) && that.cellIsAllowed_(r+1, c)) {
	    return function() {
              var color = that.blockedPieces.getAt(c,r);
              that.blockedPieces.remove(c,r);
              that.dropCell_(r, c, color);
	    };
	  }
	  return null;
	},
	"cleanBlockedPieces_");
    },

    forwardLevelToTheTicker: function() {
      this.getTicker().setLevel(this.get('level'));
    }.observes('level'),

    cellsToString: function() {
      result = [];
      for (row = 0; row < FilooFiloo.Board.RowCount; row++) {
	for (col = 0; col < FilooFiloo.Board.ColCount; col++) {
	  result.push(FilooFiloo.Game.stateToInitial[this.cellState(col, row)]);
	}
	result.push("\n");
      }
      return result.join("");
    }

});

/** Maximum number of junk pieces that can fall at once */
FilooFiloo.Board.MaxJunkLoad = 30;
FilooFiloo.Board.setMaxJunkLoad = function(value) {
  this.MaxJunkLoad = value;
};

/** Tweak the size of the board (useful for tests) */
FilooFiloo.Board.setDimensions = function(colCount, rowCount) {
    this.ColCount = colCount;
    this.MaxCol = colCount - 1;

    this.RowCount = rowCount;
    this.MaxRow = rowCount - 1;

    this.PieceStartOrigin = {row: 0, col: this.ColCount / 2 - 1 };
};

FilooFiloo.Board.areValidCoordinates = function(x,y) {
  return 0 <= x &&  x <= this.MaxCol && 0 <= y && y <= this.MaxRow;
};

FilooFiloo.Board.setDimensions(FilooFiloo.Game.ColCount, FilooFiloo.Game.RowCount);

/** Unique cell property name for a column and a row */
FilooFiloo.Board.cellProperty = function(col, row) {
  return "cell-"+(row*FilooFiloo.Board.ColCount + col);
};