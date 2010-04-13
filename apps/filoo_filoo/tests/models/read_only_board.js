// Copyright (c) 2008-2010  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.

// You should have received a copy of the MIT License along with this
// program.  If not, see <http://www.opensource.org/licenses/mit-license.php>

// ==========================================================================
// FilooFiloo.ReadOnlyBoard Unit Test
// ==========================================================================

/*globals FilooFiloo module test ok equals same stop start */

module("FilooFiloo.ReadOnlyBoard", {

  setup: function() {
    FilooFiloo.Board.setDimensions(2, 2);

    roBoard = FilooFiloo.ReadOnlyBoard.create({});

    roBoard.cellsStateShouldEqual = function(stringRows, message) {
      FilooFiloo.TestsHelpers.assertStringRows(stringRows, FilooFiloo.Board.RowCount, FilooFiloo.Board.ColCount,
					       function(c,r) {
						 return roBoard.get(FilooFiloo.Board.cellProperty(c,r));
					       }, message);
    };

    roBoard.cellsStateShouldReflectStringBoard = function(stringRows) {
      roBoard.set('boardString', stringRows.join('\n'));
      roBoard.cellsStateShouldEqual(stringRows, "cellsState should reflect specified string rows");
    };
  }

});

test("Updating the boardString should change the cells", function() {

  var cell = FilooFiloo.Board.cellProperty(1,0);
  var oldState = roBoard.get(cell);
  roBoard.set('boardString', " r\nb ");
  var newState = roBoard.get(cell);

  ok(oldState != newState, "the state of the cell should have changed");
});

test("The board should be clear when created", function() {

  roBoard.cellsStateShouldEqual(["  ","  "], "Should be clear after creation");
});

test("The cellsState function should reflect the specified boardString", function() {

  roBoard.cellsStateShouldReflectStringBoard(["  ",
					      "  "]);
  roBoard.cellsStateShouldReflectStringBoard(["rb",
					      "py"]);
});

test("The board should be cleared when set a null boardString", function() {

  roBoard.cellsStateShouldReflectStringBoard(["rb",
					      "py"]);

  roBoard.set('boardString', null);
  roBoard.cellsStateShouldEqual(["  ","  "], "Should be cleared by a null boardString");
});

test("The read only board should never be playing", function() {

  equals(NO, roBoard.get('playing'), "Should not be playing after creation");

  roBoard.set('boardString', "rb\npy");
  equals(NO, roBoard.get('playing'), "Should not be playing after a board string was set");

});
