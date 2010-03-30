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
// FilooFiloo.ReadOnlyBoard Unit Test
// ==========================================================================

/*globals FilooFiloo module test ok equals same stop start */

module("FilooFiloo.ReadOnlyBoard", {

  setup: function() {
    FilooFiloo.Board.setDimensions(2, 2);

    roBoard = FilooFiloo.ReadOnlyBoard.create({});

    roBoard.cellStateShouldEqual = function(stringRows, message) {
      FilooFiloo.TestsHelpers.assertStringRows(stringRows, FilooFiloo.Board.RowCount, FilooFiloo.Board.ColCount, function(c,r) { return roBoard.cellState(c,r); }, message);
    };

    roBoard.cellStateShouldReflectStringBoard = function(stringRows) {
      roBoard.set('boardString', stringRows.join('\n'));
      roBoard.cellStateShouldEqual(stringRows, "cellState should reflect specified string rows");
    };
  }

});

test("Updating the boardString should change the time", function() {

  var oldTime = roBoard.get('time');
  roBoard.set('boardString', " r\nb ");
  var time = roBoard.get('time');

  ok(oldTime != time, "the time should have changed");
});

test("The board should be clear when created", function() {

  roBoard.cellStateShouldEqual(["  ","  "], "Should be clear after creation");
});

test("The cellState function should reflect the specified boardString", function() {

  roBoard.cellStateShouldReflectStringBoard(["  ",
					     "  "]);
  roBoard.cellStateShouldReflectStringBoard(["rb",
					     "py"]);
});

test("The board should be cleared when set a null boardString", function() {

  roBoard.cellStateShouldReflectStringBoard(["rb",
					     "py"]);

  roBoard.set('boardString', null);
  roBoard.cellStateShouldEqual(["  ","  "], "Should be cleared by a null boardString");
});

test("The read only board should never be playing", function() {

  equals(NO, roBoard.get('playing'), "Should not be playing after creation");

  roBoard.set('boardString', "rb\npy");
  equals(NO, roBoard.get('playing'), "Should not be playing after a board string was set");

});
