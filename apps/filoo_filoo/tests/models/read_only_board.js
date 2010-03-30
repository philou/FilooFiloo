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

    roBoard.cellStateShouldReflectStringBoard = function(stringRows) {
      roBoard.set('boardString', stringRows.join('\n'));

      FilooFiloo.TestsHelpers.assertStringRows(stringRows, FilooFiloo.Board.RowCount, FilooFiloo.Board.ColCount, function(c,r) { return roBoard.cellState(c,r); }, "cellState should reflect specified string rows");
    };
  }

});

test("Updating the boardString should change the time", function() {

  var oldTime = roBoard.get('time');
  roBoard.set('boardString', " r\nb ");
  var time = roBoard.get('time');

  ok(oldTime != time, "the time should have changed");
});

test("The cellState function should reflect the specified boardString", function() {

  roBoard.cellStateShouldReflectStringBoard(["  ",
					     "  "]);
  roBoard.cellStateShouldReflectStringBoard(["rb",
					     "py"]);
});


test("The read only board should never be playing", function() {

  equals(NO, roBoard.get('playing'), "Should not be playing after creation");

  roBoard.set('boardString', "rb\npy");
  equals(NO, roBoard.get('playing'), "Should not be playing after a board string was set");

});
