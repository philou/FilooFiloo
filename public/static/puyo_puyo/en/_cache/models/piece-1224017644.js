/* Start ----------------------------------------------------- models/piece.js*/

// ==========================================================================
// PuyoPuyo.Piece
// ==========================================================================

require('core');
require('models/game');

/** @class

  Objects representing the current falling puyo-puyo couple.

  @extends SC.Record
  @author Philou
  @version 0.1
*/
PuyoPuyo.Piece = SC.Record.extend(
/** @scope PuyoPuyo.Piece.prototype */ {

    /**
      Origin position of the piece.
    */
    center: {row: 0, col:0},
    
    /**
      Colors of the puyos in the piece. first is for the origin.
    */
    colors: {first: PuyoPuyo.Game.Red, second: PuyoPuyo.Game.Red },

    /**
      Orientation of the piece.
    */
    orientation: PuyoPuyo.Piece.Right;

    /**
      State of a cell according to the piece. A color or clear if the cell is not occupied by the piece.
    */
    cellState: function(col, row) {
	if (row === this.center.row) {
	    switch(col) {
	    case this.center.col:
		return this.colors.first;
	    case this.center.col + 1:
		return this.colors.second;
	    }
	}
	return PuyoPuyo.Game.Clear;
    },

    /**
      Enumerates all cells occupied by the piece.
    */
    forEach: function(doSomething) {
	doSomething(this.center.row, this.center.col, this.colors.first);
	doSomething(this.center.row, this.center.col + 1, this.colors.second);
    },

    /**
      Creates a new piece further down.
    */
    down: function() {
	return PuyoPuyo.Piece.create(
	    {center: {row: this.center.row + 1, col: this.center.col },
	     colors: this.colors,
	     orientation: this.orientation});
    },

    /**
      Creates a new piece at the left.
    */
    left: function() {
	return PuyoPuyo.Piece.create(
	    {center: {row: this.center.row, col: this.center.col - 1 },
	     colors: this.colors,
	     orientation: this.orientation});
    },

    /**
      Creates a new piece at the right.
    */
    right: function() {
	return PuyoPuyo.Piece.create(
	    {center: {row: this.center.row, col: this.center.col + 1 },
	     colors: this.colors,
	     orientation: this.orientation});
    },

    /**
      Creates a new rotated piece.
    */
    rotate: function() {
	return PuyoPuyo.Piece.create(
	    {center: {row: this.center.row, col: this.center.col},
	     colors: this.colors,
	     orientation: this.rotatedOrientation(this.orientation)});
    },

    rotateOrientation_: function(orientation) {
	with(PuyoPuyo.Piece)
	{
	    switch(orientation)
	    {
	    case Right: return Up;
	    case Up: return Left;
	    case Left: return Down;
	    case Down: return Right;
	    }
	}
	throw "unexpected orientation";
    }

}) ;

PuyoPuyo.Piece.Right = "right";
PuyoPuyo.Piece.Up = "up";
PuyoPuyo.Piece.Left = "left";
PuyoPuyo.Piece.Down = "down";



/* End ------------------------------------------------------- models/piece.js*/

