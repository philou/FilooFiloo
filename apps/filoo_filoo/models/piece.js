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
// FilooFiloo.Piece
// ==========================================================================

require('models/game');

/** @class

  Objects representing the current falling filoo-filoo couple.

  @extends SC.Record
  @author Philou
  @version 0.1
*/
FilooFiloo.Piece = SC.Record.extend(
/** @scope FilooFiloo.Piece.prototype */ {

    /**
      Origin position of the piece.
    */
    center: {row: 0, col:0},

    /**
      Colors of the filoos in the piece. first is for the origin.
    */
    colors: {first: FilooFiloo.Game.Red, second: FilooFiloo.Game.Red },

    /**
      Orientation of the piece.
    */
    orientation: "Right",

    /**
      State of a cell according to the piece. A color or clear if the cell is not occupied by the piece.
    */
    cellState: function(col, row) {
	if ((this.center.row === row) && (this.center.col === col))
	    return this.colors.first;

	if ((this.secondCell_().row === row) && (this.secondCell_().col === col))
	    return this.colors.second;

	return FilooFiloo.Game.Clear;
    },

    /**
      Enumerates all cells occupied by the piece.
    */
    forEach: function(doSomething) {
	if ("Down" === this.orientation) {
	    doSomething(this.secondCell_().row, this.secondCell_().col, this.colors.second);
	    doSomething(this.center.row, this.center.col, this.colors.first);
	}
	else {
	    doSomething(this.center.row, this.center.col, this.colors.first);
	    doSomething(this.secondCell_().row, this.secondCell_().col, this.colors.second);
	}
    },

    /**
      Creates a new piece further down.
    */
    down: function() {
	return FilooFiloo.Piece.create(
	    {center: {row: this.center.row + 1, col: this.center.col },
	     colors: this.colors,
	     orientation: this.orientation});
    },

    /**
      Creates a new piece at the left.
    */
    left: function() {
	return FilooFiloo.Piece.create(
	    {center: {row: this.center.row, col: this.center.col - 1 },
	     colors: this.colors,
	     orientation: this.orientation});
    },

    /**
      Creates a new piece at the right.
    */
    right: function() {
	return FilooFiloo.Piece.create(
	    {center: {row: this.center.row, col: this.center.col + 1 },
	     colors: this.colors,
	     orientation: this.orientation});
    },

    /**
      Creates a new rotated piece.
    */
    rotate: function() {
	return FilooFiloo.Piece.create(
	    {center: {row: this.center.row, col: this.center.col},
	     colors: this.colors,
	     orientation: this.rotateOrientation_(this.orientation)});
    },

    /**
      Creates a new anti rotated piece.
    */
    antiRotate: function() {
	return FilooFiloo.Piece.create(
	    {center: {row: this.center.row, col: this.center.col},
	     colors: this.colors,
	     orientation: this.antiRotateOrientation_(this.orientation)});
    },

    secondCell_: function() {
	switch(this.orientation)
	{
	case "Right": return {row: this.center.row, col: this.center.col + 1 };
	case "Up": return {row: this.center.row - 1, col: this.center.col };
	case "Left": return {row: this.center.row, col: this.center.col - 1 };
	case "Down": return {row: this.center.row + 1, col: this.center.col };
	}
	throw "unexpected orientation";
    },

    rotateOrientation_: function(orientation) {
	switch(orientation)
	{
	case "Right": return "Up";
	case "Up": return "Left";
	case "Left": return "Down";
	case "Down": return "Right";
	}
	throw "unexpected orientation";
    },

    antiRotateOrientation_: function(orientation) {
	switch(orientation)
	{
	case "Right": return "Down";
	case "Up": return "Right";
	case "Left": return "Up";
	case "Down": return "Left";
	}
	throw "unexpected orientation";
    }

}) ;


