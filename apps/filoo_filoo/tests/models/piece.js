// Copyright (c) 2008-2010 Philippe Bourgau

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


// ========================================================================
// FilooFiloo.Piece Unit Test
// ========================================================================

module("FilooFiloo.Piece",{

    setup: function() {
      assertPiece = function(stringRows, piece) {
	FilooFiloo.TestsHelpers.assertStringRows(stringRows, 5, 5, function(c,r) {
	  return piece.cellState(piece.get('center').col + c - 2, piece.get('center').row + r - 2);
        }, "");
      };

      piece = FilooFiloo.Piece.create({
	center: {row: 3, col: 2},
	colors: {first: FilooFiloo.Game.Red, second: FilooFiloo.Game.Blue}});
    },
    teardown: function() {
      assertPiece = undefined;
      piece = undefined;
    }
});

test("A new piece should contain its origin and the cell at its right", function() {
  assertPiece(["     ",
	       "     ",
	       "  rb ",
               "     ",
               "     "],
               piece);
});

test("The piece should change when rotated.", function() {
  piece = piece.rotate();
  assertPiece(["     ",
	       "  b  ",
               "  r  ",
               "     ",
               "     "],
               piece);
  piece = piece.rotate();
  assertPiece(["     ",
	       "     ",
               " br  ",
               "     ",
               "     "],
               piece);
  piece = piece.rotate();
  assertPiece(["     ",
               "     ",
               "  r  ",
               "  b  ",
               "     "],
              piece);
  piece = piece.rotate();
  assertPiece(["     ",
	       "     ",
               "  rb ",
               "     ",
               "     "],
               piece);
});

test("The piece should change when anti rotated.", function() {
  piece = piece.antiRotate();
  assertPiece(["     ",
	       "     ",
               "  r  ",
               "  b  ",
               "     "],
               piece);
  piece = piece.antiRotate();
  assertPiece(["     ",
	       "     ",
	       " br  ",
               "     ",
               "     "],
               piece);
  piece = piece.antiRotate();
  assertPiece(["     ",
	       "  b  ",
               "  r  ",
               "     ",
               "     "],
               piece);
  piece = piece.antiRotate();
  assertPiece(["     ",
	       "     ",
               "  rb ",
               "     ",
	       "     "],
	       piece);
});

test("forEach should enumerate both cells", function() {
  var expected =
      [{row:3, col:2, color:FilooFiloo.Game.Red},
       {row:3, col:3, color:FilooFiloo.Game.Blue}];
  var i = 0;
  piece.forEach(function(row, col, color) {
    equals(row, expected[i].row);
    equals(col, expected[i].col);
    equals(color, expected[i].color);
    i++;
  });
  equals(i, expected.length);
});

test("forEach should enumerate cells from bottom to top", function() {
  ["Down", "Up"].forEach( function(orientation) {
      piece.orientation = orientation;
      var previousRow = FilooFiloo.Board.MaxRow + 1;
      piece.forEach(function(row, col, color) {
	ok(row < previousRow);
	previousRow = row;
      });
  });
});

