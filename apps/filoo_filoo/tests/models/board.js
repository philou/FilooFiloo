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
// FilooFiloo.Board Unit Test
// ========================================================================

module("FilooFiloo.Board",{

    setup: function() {
	FilooFiloo.Board.setDimensions(4, 6);

	ticker = {
	    running: false,
            level: -1,
	    start: function() {
		this.running = true;
	    },
	    stop: function() {
		this.running = false;
	    },
            setLevel: function(level) {
                this.level = level;
            }
	};

	colorProvider = {
	    firstColor: FilooFiloo.Game.Red,
	    secondColor: FilooFiloo.Game.Blue,
	    popFirstColor: function() {
		return this.firstColor;
	    },
	    popSecondColor: function() {
		return this.secondColor;
	    }
	};

	board = FilooFiloo.Board.create({ticker: ticker, colorProvider: colorProvider});

	board.shouldBe = function(stringRows, message) {
            var board = this;
            FilooFiloo.TestsHelpers.assertStringRows(stringRows, FilooFiloo.Board.RowCount, FilooFiloo.Board.ColCount,
						     function(c,r) {
						       return board.get(FilooFiloo.Board.cellProperty(c,r));
						     }, message);
	};

        board.shouldBeEmpty = function(message) {
          this.shouldBe( ["    ",
			  "    ",
			  "    ",
			  "    ",
			  "    ",
			  "    "],
                          message);
        };

	/***
          Allows to specify test sequences from left to right instead of top to bottom.
        */
	board.shouldFollow = function(behaviour) {
	    var steps = [];
	    var count = behaviour.action.length;
	    for(var i = 0; i < count; ++i) {
		steps[i] = { actionName: behaviour.action[i],
			     message: "step "+i+" : "+behaviour.action[i],
                             extraChecks: {}};
                for(var name in behaviour) {
                    if ((name !== "action") && (name !== "board") && behaviour.hasOwnProperty(name)) {
                        steps[i].extraChecks[name] = behaviour[name][i];
                    }
                }
	    }
            var stringRows = FilooFiloo.TestsHelpers.transpose(behaviour.board, count);

	    for(var i = 0; i < steps.length; ++i) {
	      var result = this[steps[i].actionName]();
	      var iExpectedRows = function() {
		if (stringRows[i] === idem) {
		  return i-1;
		}
		return i;
	      }();
	      this.shouldBe(stringRows[iExpectedRows], steps[i].message);
              var extraChecks = steps[i].extraChecks;
              for (var name in extraChecks) {
                if (extraChecks.hasOwnProperty(name)) {
                  equals(this.get(name), extraChecks[name], "wrong "+name+" at "+steps[i].message);
                }
	      }
	    }
	};

	board.startWithBoard = function(stringRows) {
	    this.start(FilooFiloo.TestsHelpers.newCoordMap(stringRows));
	};
        board.tickN = function(n) {
            for(var i = 0; i < n; ++i) {
                this.tick();
            }
        };
        board.dropFiloos = function(count){
            var board = this;
            FilooFiloo.TestsHelpers.times(Math.floor(count/2), function() {
                board.tick(); board.drop(); board.tick();
            });
        };

    },

    teardown: function() {
      board = undefined;
    }
});

test("The board's playing property should change with start and stop", function() {
	ok(board);
	equals(board.get('playing'), false);

	board.start();
	equals(board.get('playing'), true);

	board.abort();
	equals(board.get('playing'), false);
});

test("The ticker should be started with the board", function() {
	equals(ticker.running, false);

	board.start();
	equals(ticker.running, true);

	board.abort();
	equals(ticker.running, false);
});

test("The board should start empty", function() {
	board.shouldFollow({action:["start"],
			    board: ["    ",
			            "    ",
			            "    ",
			            "    ",
			            "    ",
			            "    "]});
});

test("A piece should appear at first tick and move down at each tick.", function() {
	board.start();
	board.shouldFollow({action:["tick", "tick", "tick", "tick", "tick", "tick"],
			    board: [" rb ", "    ", "    ", "    ", "    ", "    ",
			            "    ", " rb ", "    ", "    ", "    ", "    ",
			            "    ", "    ", " rb ", "    ", "    ", "    ",
			            "    ", "    ", "    ", " rb ", "    ", "    ",
			            "    ", "    ", "    ", "    ", " rb ", "    ",
			            "    ", "    ", "    ", "    ", "    ", " rb "]});
});

test("A new game should be started after an abort.", function() {
	board.start();
	board.tick();

	board.shouldFollow({action:["tick", "abort", "start"],
			    board: ["    ",  idem,   "    ",
			            " rb ",  idem,   "    ",
			            "    ",  idem,   "    ",
			            "    ",  idem,   "    ",
			            "    ",  idem,   "    ",
			            "    ",  idem,   "    "]});
});

test("New pieces should have colors from colorProvider.", function() {
	colorProvider.firstColor = FilooFiloo.Game.Purple;
	colorProvider.secondColor = FilooFiloo.Game.Yellow;

	board.start();
	board.tick();
	board.shouldBe([" py ",
			"    ",
			"    ",
			"    ",
			"    ",
			"    "]);
});

test("A piece should move with left and right", function() {
	board.start();
	board.shouldFollow({action:["tick", "left", "right"],
			    board: [" rb ", "rb  ", " rb ",
			            "    ", "    ", "    ",
			            "    ", "    ", "    ",
			            "    ", "    ", "    ",
			            "    ", "    ", "    ",
			            "    ", "    ", "    "]});
});

test("A piece should rotate", function() {
	board.start();
	board.tick();
  	board.shouldFollow({action:["tick", "rotate", "rotate", "rotate", "rotate"],
			    board: ["    ", " b  ",   "    ",   "    ",   "    ",
			            " rb ", " r  ",   "br  ",   " r  ",   " rb ",
			            "    ", "    ",   "    ",   " b  ",   "    ",
			            "    ", "    ",   "    ",   "    ",   "    ",
			            "    ", "    ",   "    ",   "    ",   "    ",
			            "    ", "    ",   "    ",   "    ",   "    "]});
});

test("A piece should anti rotate", function() {
	board.start();
	board.tick();
	board.shouldFollow({action:["tick", "antiRotate", "antiRotate", "antiRotate", "antiRotate"],
			    board: ["    ", "    ",       "    ",       " b  ",       "    ",
			            " rb ", " r  ",       "br  ",       " r  ",       " rb ",
			            "    ", " b  ",       "    ",       "    ",       "    ",
			            "    ", "    ",       "    ",       "    ",       "    ",
			            "    ", "    ",       "    ",       "    ",       "    ",
			            "    ", "    ",       "    ",       "    ",       "    "]});
});

test("It should not be possible to move a piece outside the board", function() {
	board.start();
	board.shouldFollow({action:["tick", "left", "left", "right", "right", "right"],
			    board: [" rb ", "rb  ", idem,   " rb ",  "  rb",  idem,
			            "    ", "    ", idem,   "    ",  "    ",  idem,
			            "    ", "    ", idem,   "    ",  "    ",  idem,
			            "    ", "    ", idem,   "    ",  "    ",  idem,
			            "    ", "    ", idem,   "    ",  "    ",  idem,
			            "    ", "    ", idem,   "    ",  "    ",  idem]});
});

test("A new piece should appear when the previous one gets blocked at the bottom of the board", function() {
	board.start();
        board.tickN(FilooFiloo.Board.MaxRow + 1);
	board.shouldBe(["    ",
			"    ",
			"    ",
			"    ",
			"    ",
			" rb "],
		       "initialy");

	board.shouldFollow({action:["tick", "tick"],
			    board: ["    ", " rb ",
			            "    ", "    ",
			            "    ", "    ",
			            "    ", "    ",
			            "    ", "    ",
			            " rb ", " rb "]});
});

test("Blocked piece should pile on top of each other.", function() {
	board.startWithBoard(["    ",
			      "    ",
			      "    ",
			      "    ",
			      "    ",
			      " yp "]);
        board.tickN(FilooFiloo.Board.MaxRow -1);
	board.shouldBe(["    ",
			"    ",
			"    ",
			" rb ",
			"    ",
			" yp "],
		       "initialy");

	board.shouldFollow({action:["tick", "tick"],
			    board: ["    ", "    ",
			            "    ", "    ",
			            "    ", "    ",
			            "    ", "    ",
			            " rb ", " rb ",
			            " yp ", " yp "]});
});

test("Filoos of vertical pieces should be blocked on top of each other.", function() {
	board.start();
        board.tickN(FilooFiloo.Board.MaxRow);
	board.antiRotate();
	board.shouldBe(["    ",
			"    ",
			"    ",
			"    ",
			" r  ",
			" b  "],
		       "initialy");

	board.shouldFollow({action:["tick"],
			    board: ["    ",
			            "    ",
			            "    ",
			            "    ",
			            " r  ",
			            " b  "]});
});

test("Blocked beans should follow the law of gravity", function() {
	board.startWithBoard(["    ",
			      "    ",
			      "    ",
			      "    ",
			      "    ",
			      "yp  "]);
        board.tickN(FilooFiloo.Board.MaxRow);
	board.shouldBe(["    ",
			"    ",
			"    ",
			"    ",
			" rb ",
			"yp  "],
		       "initialy");

	board.shouldFollow({action:["tick"],
			    board: ["    ",
			            "    ",
			            "    ",
			            "    ",
			            " r  ",
			            "ypb "]});
});

test("Pieces should drop at the bottom.", function() {
	board.start();
	board.shouldFollow({action:["tick", "drop", "tick", "drop"],
			    board: [" rb ", "    ", " rb ", "    ",
			            "    ", "    ", "    ", "    ",
			            "    ", "    ", "    ", "    ",
			            "    ", "    ", "    ", "    ",
			            "    ", "    ", "    ", " rb ",
			            "    ", " rb ", " rb ", " rb "]});
});

test("Pieces should follow the law of gravity when droped.", function() {
	board.start();
	board.shouldFollow({action:["tick", "drop", "tick", "right", "drop"],
			    board: [" rb ", "    ", " rb ", "  rb",  "    ",
			            "    ", "    ", "    ", "    ",  "    ",
			            "    ", "    ", "    ", "    ",  "    ",
			            "    ", "    ", "    ", "    ",  "    ",
			            "    ", "    ", "    ", "    ",  "  r ",
			            "    ", " rb ", " rb ", " rb ",  " rbb"]});
});

test("When grouped by 4 or more, beans of the same color should disappear", function() {
	colorProvider.firstColor = FilooFiloo.Game.Red;
	colorProvider.secondColor = FilooFiloo.Game.Red;

        board.start();
	board.shouldFollow({action:["tick", "drop", "tick", "drop", "tick", "tick"],
			    board: [" rr ", "    ", " rr ", "    ", "    ", " rr ",
			            "    ", "    ", "    ", "    ", "    ", "    ",
			            "    ", "    ", "    ", "    ", "    ", "    ",
			            "    ", "    ", "    ", "    ", "    ", "    ",
			            "    ", "    ", "    ", " rr ", "    ", "    ",
			            "    ", " rr ", " rr ", " rr ", "    ", "    "]});
});

test("Groups of junk should not disappear, no matter how large", function() {
  colorProvider.firstColor = FilooFiloo.Game.Red;
  colorProvider.secondColor = FilooFiloo.Game.Red;

  board.startWithBoard(["    ",
			"    ",
			"    ",
			"j   ",
			"jj  ",
			"jjj "]);

  board.shouldFollow({action:["tick", "drop", "tick"],
		      board: [" rr ", "    ", " rr ",
			      "    ", "    ", "    ",
			      "    ", "    ", "    ",
			      "j   ", "jr  ", "jr  ",
			      "jj  ", "jjr ", "jjr ",
			      "jjj ", "jjj ", "jjj "]});
});

test("If blocking the piece several groups, all should disappear", function() {
	board.startWithBoard(["    ",
			      "    ",
			      "    ",
			      "r  b",
			      "r  b",
			      "r  b"]);
	board.shouldFollow({action:["tick", "drop", "tick"],
			    board: [" rb ", "    ", "    ",
			            "    ", "    ", "    ",
			            "    ", "    ", "    ",
			            "r  b", "r  b", "    ",
			            "r  b", "r  b", "    ",
			            "r  b", "rrbb", "    "]});
});

test("Pieces on top of a disappearing group should fall", function() {
	board.startWithBoard(["    ",
			      "p   ",
			      "y   ",
			      "b   ",
			      "r   ",
			      "r   "]);
	colorProvider.firstColor = FilooFiloo.Game.Red;
	colorProvider.secondColor = FilooFiloo.Game.Red;

	board.shouldFollow({action:["tick", "drop", "tick", "tick"],
			    board: [" rr ", "    ", "    ", "    ",
			            "p   ", "p   ", "p   ", "    ",
			            "y   ", "y   ", "y   ", "    ",
			            "b   ", "b   ", "b   ", "p   ",
			            "r   ", "r   ", "    ", "y   ",
			            "r   ", "rrr ", "    ", "b   "]});
});

test("Disappearing beans should cascade", function() {
	board.startWithBoard(["    ",
			      "    ",
			      " r  ",
			      " r  ",
			      "rb  ",
			      "rb  "]);
	colorProvider.firstColor = FilooFiloo.Game.Blue;
	colorProvider.secondColor = FilooFiloo.Game.Blue;

	board.shouldFollow({action:["tick", "right","drop", "tick", "tick", "tick"],
			    board: [" bb ", "  bb", "    ", "    ", "    ", "    ",
			            "    ", "    ", "    ", "    ", "    ", "    ",
			            " r  ", " r  ", " r  ", " r  ", "    ", "    ",
			            " r  ", " r  ", " r  ", " r  ", "    ", "    ",
			            "rb  ", "rb  ", "rb  ", "r   ", "rr  ", "    ",
			            "rb  ", "rb  ", "rbbb", "r   ", "rr  ", "    "]});
});

test("Game should be lost when there is no place for new pieces", function() {
	board.startWithBoard([" rr ",
			      " bb ",
			      " rr ",
			      " bb ",
			      " rr ",
			      " bb "]);
	equals(board.get('playing'), true);

        var lastGameOverTime = board.get('gameOver');
	board.tick();
	equals(board.get('playing'), false);
        ok(lastGameOverTime !== board.get('gameOver'));
});

test("Disappeared pieces should be counted", function() {
	board.startWithBoard(["    ",
			      "    ",
			      "    ",
			      "r   ",
			      "r   ",
			      "r   "]);
	colorProvider.firstColor = FilooFiloo.Game.Red;
	colorProvider.secondColor = FilooFiloo.Game.Red;

        equals(board.get('disappearedPieces'), 0);

        board.tick(); board.drop(); board.tick();

        board.shouldBeEmpty();
        equals(board.get('disappearedPieces'), 5);

        board.tick(); board.drop(); board.tick();
        board.tick(); board.drop(); board.tick();

        board.shouldBeEmpty();
        equals(board.get('disappearedPieces'), 9);
});

test("The level should increase when pieces disappear", function() {
	colorProvider.firstColor = FilooFiloo.Game.Red;
	colorProvider.secondColor = FilooFiloo.Game.Red;

	board.start();
        equals(board.get('disappearedPieces'), 0);
        equals(board.get('level'), 1);

        board.dropFiloos(FilooFiloo.Game.LevelUpgrade + 2);
        equals(board.get('disappearedPieces'), FilooFiloo.Game.LevelUpgrade + 2);
        equals(board.get('level'), 2);

        board.dropFiloos(FilooFiloo.Game.LevelUpgrade + 2);
        equals(board.get('disappearedPieces'), 2 * (FilooFiloo.Game.LevelUpgrade + 2));
        equals(board.get('level'), 3);
});
test("Level changes should be forwarded to the ticker", function() {
	colorProvider.firstColor = FilooFiloo.Game.Red;
	colorProvider.secondColor = FilooFiloo.Game.Red;

	board.start();
        equals(board.get('level'), 1);

        board.dropFiloos(FilooFiloo.Game.LevelUpgrade + 2);
        equals(board.get('level'), 2);

        equals(ticker.level, 2);
});
test("The score should be increased when pieces are disappeared with a rensa", function() {
	colorProvider.firstColor = FilooFiloo.Game.Red;
	colorProvider.secondColor = FilooFiloo.Game.Red;

	board.startWithBoard(["    ",
			      "    ",
			      "    ",
			      "    ",
			      "r   ",
			      "r   "]);
	board.shouldFollow({action:["tick", "drop", "tick", "tick"],
	                    board: [" rr ", "    ", "    ", " rr ",
                                    "    ", "    ", "    ", "    ",
	                            "    ", "    ", "    ", "    ",
	                            "    ", "    ", "    ", "    ",
	                            "r   ", "r   ", "    ", "    ",
	                            "r   ", "rrr ", "    ", "    "],
                            score: [     0,      0,      0,     40]});
});
test("The score should be increased when pieces are disappeared with a combo", function() {
	colorProvider.firstColor = FilooFiloo.Game.Red;
	colorProvider.secondColor = FilooFiloo.Game.Blue;

	board.startWithBoard(["    ",
			      "    ",
			      "    ",
			      "r  b",
			      "r  b",
			      "r  b"]);
	board.shouldFollow({action:["tick", "drop", "tick", "tick"],
	                    board: [" rb ", "    ", "    ", " rb ",
                                    "    ", "    ", "    ", "    ",
	                            "    ", "    ", "    ", "    ",
	                            "r  b", "r  b", "    ", "    ",
	                            "r  b", "r  b", "    ", "    ",
	                            "r  b", "rrbb", "    ", "    "],
                            score: [     0,      0,      0,    400]});
});
test("The score should be increased when pieces are disappeared with a rensa chain", function() {
	colorProvider.firstColor = FilooFiloo.Game.Blue;
	colorProvider.secondColor = FilooFiloo.Game.Blue;

	board.startWithBoard(["    ",
			      " r  ",
			      " r  ",
			      " r  ",
			      "rb  ",
			      "rb  "]);
	board.shouldFollow({action:["tick", "right","drop", "tick", "tick", "tick", "tick"],
	                    board: [" bb ", "  bb", "    ", "    ", "    ", "    ", " bb ",
                                    " r  ", " r  ", " r  ", " r  ", "    ", "    ", "    ",
	                            " r  ", " r  ", " r  ", " r  ", "    ", "    ", "    ",
	                            " r  ", " r  ", " r  ", " r  ", " r  ", "    ", "    ",
	                            "rb  ", "rb  ", "rb  ", "r   ", "rr  ", "    ", "    ",
	                            "rb  ", "rb  ", "rbbb", "r   ", "rr  ", "    ", "    "],
                            score: [     0,      0,      0,      0,      0,      0,    540]});
});

test("board to string should handle main colors", function() {
      boardArray = [" bb ",
                    " r  ",
		    " r  ",
	            " r  ",
	            "rb  ",
	            "rb  "];

      board.startWithBoard(boardArray);

      equals(board.cellsToString(), boardArray.join("\n")+"\n");
});

test("Cells property names should be unique", function() {

  var memo = {};

  for(var col = 0; col < FilooFiloo.Board.ColCount; col++) {
    for(var row = 0; row < FilooFiloo.Board.RowCount; row++) {
      var cellProperty = FilooFiloo.Board.cellProperty(col, row);
      ok(!memo[cellProperty], "Duplicate cell property name: "+cellProperty );
      memo[cellProperty] = YES;
    }
  }

});

// tester le nouveau mode de propriétés: changer la fonction principale?