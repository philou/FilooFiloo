// Copyright (c) 2008-2009  Philippe Bourgau

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
// FilooFiloo.CoordMap Unit Test
// ========================================================================

module("FilooFiloo.CoordMap",{

    setup: function() {
        assertPieceContaining = function(fullMapRows, x, y, subPieceRows, message) {
            subPieceRows = subPieceRows || fullMapRows;
            var fullMap = FilooFiloo.TestsHelpers.newCoordMap(fullMapRows);
            var subPiece = fullMap.pieceContaining(x, y);
            var expectedSubPiece = FilooFiloo.TestsHelpers.newCoordMap(subPieceRows);

            ok(expectedSubPiece.equals(subPiece), message);
        };

        assertCreatePutEachEquals = function(mapRows) {
            var map = FilooFiloo.TestsHelpers.newCoordMap(mapRows);
            var copy = FilooFiloo.CoordMap.create();
            map.each(function(x,y,value) {
                copy.put(x,y,value);
            });

            ok(map.equals(copy));
        };

        removeEachShouldWork = function(startRows, removedRows, expectedRows) {
            var start = FilooFiloo.TestsHelpers.newCoordMap(startRows);
            var removed = FilooFiloo.TestsHelpers.newCoordMap(removedRows);
            var expected = FilooFiloo.TestsHelpers.newCoordMap(expectedRows);

            start.removeEach(removed);

            ok(expected.equals(start));
        };
    },
    tearDown: function() {
      assertPieceContaining = undefined;
      assertCreatePutEachEquals = undefined;
      removeEachShouldWork = undefined;
    }
});

test("Stored values should be remembered", function() {
  var map = FilooFiloo.CoordMap.create();
  map.put(2, 4, "some value");
  map.put(3, 4, "something else");

  equals("some value", map.getAt(2, 4));
  equals("something else", map.getAt(3, 4));
});

test("Absent values should be reported as null", function() {
  var map = FilooFiloo.CoordMap.create();
  map.put(2, 4, "something");
  equals(null, map.getAt(3, 4));
});

test("Instances should not share state", function() {
  var map = FilooFiloo.CoordMap.create();
  var map2 = FilooFiloo.CoordMap.create();
  map.put(2, 4, "something");

  equals(null, map2.getAt(2,4));
});

test("Count should be updated with additions", function() {
  var map = FilooFiloo.CoordMap.create();
  equals(0, map.get('count'));

  map.put(2, 3, "something");
  equals(1, map.get('count'));

  map.put(3, 1, "some other thing");
  equals(2, map.get('count'));

  map.put(2, 3, "something else");
  equals(2, map.get('count'));

  map.put(4, 5, null);
  equals(2, map.get('count'));
});

test("GetAt should return null once the coord was removed", function() {
  var map = FilooFiloo.CoordMap.create();
  map.put(2, 3, "something");
  equals("something", map.getAt(2, 3));

  map.remove(2,3);
  equals(null, map.getAt(2,3));
});

test("Remove should update the count", function() {
  var map = FilooFiloo.CoordMap.create();
  map.put(2, 3, "something");
  equals(1, map.get('count'));

  map.remove(2,3);
  equals(0, map.get('count'));
});

test("Equals shouls work correctly", function() {
  ok(
      !FilooFiloo.TestsHelpers.newCoordMap(["r"]).equals(
          FilooFiloo.TestsHelpers.newCoordMap(["bb"])));

  ok(
      !FilooFiloo.TestsHelpers.newCoordMap(["rr"]).equals(
          FilooFiloo.TestsHelpers.newCoordMap(["bb"])));

  ok(
      !FilooFiloo.TestsHelpers.newCoordMap(["r r"]).equals(
          FilooFiloo.TestsHelpers.newCoordMap(["rrr"])));
});

test("One colored maps should not be split", function() {
  assertPieceContaining(
      ["     ",
       "r    ",
       "rrr  "],
      0, 1);
});

test("Multiple colors maps should be split according to the colors", function() {
  assertPieceContaining(
      ["  bbb",
       "rbbb ",
       "rrr  "],
      1, 1,
      ["  bbb",
       " bbb ",
       "     "]);
});

test("Separated same coloured pieces should be split in many.", function() {
  assertPieceContaining(
      ["    r",
       "   rr",
       "rrr  "],
      4, 0,
      ["    r",
       "   rr",
       "     "]);
});

test("Spliting in an empty region should return an empty map.", function() {
  assertPieceContaining(
      ["    r",
       "   rr",
       "rrr  "],
      0, 0,
      ["     ",
       "     ",
       "     "]);
});

test("Copying a map copy through each put should be equal to the original", function() {
  assertCreatePutEachEquals(
      ["  bbb",
       "rbbb ",
       "rrr  "]);

  assertCreatePutEachEquals(
      ["    r",
       "   rr",
       "rrr  "]);
});

test("Remove each should work", function() {
  removeEachShouldWork(
      ["gbbgr",
       "ppprr",
       "rrryy"],
      ["g   g",
       " g g ",
       "  g  "],
      [" bbg ",
       "p p r",
       "rr yy"]);
});

