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

// ========================================================================
// FilooFiloo.PlayerController Unit Test
// ========================================================================

sc_require('models/player');

module("FilooFiloo.VersusController",{

  setup: function()  {
    FilooFiloo.loginController = FilooFiloo.createLoginController();
    versusController = FilooFiloo.createVersusController();

    store = {
      createRecord: function(klass, values) {
	var rp = " rp ";
	var pr = " pr ";
        var result = FilooFiloo.store.createRecord(klass, values);
	result.commitCalled = NO;
	result.commitRecord = function() {
	  result.commitCalled = YES;
        };
  	result.refreshCalled = NO;
	result.refresh = function() {
          this.refreshCalled = YES;
	  if (this.get('boardString') == rp)
	    this.set('boardString', pr);
	  else
	    this.set('boardString', rp);
        };
        return result;
      }
    };

    versusController.store = store;

    versusController.Timer = {
      schedule: function(params) {
	params.invalidateCalled = NO;
	params.invalidate= function() {
  	  this.invalidateCalled = YES;
  	};
        return SC.Object.create(params);
      }
    };
    tickTimer = function() {
      var timer = versusController.get('timer');
      ok(timer, "The timer should have been created");
      ok(timer.get('target'), "The timer should have a target");
      ok(timer.get('action'), "The timer should have an action");
      equals(timer.get('repeats'), YES,"The timer should repeat");

      timer.get('target')[timer.get('action')]();
    };
    enterVersusMode = function() {
      versusController.set('currentMode', 'FilooFiloo.versusPage.mainView');
    };

    startAGame = function() {
      FilooFiloo.loginController.set('name', 'zinzin');
      enterVersusMode();

      versusController.get('player').set('opponent', store.createRecord(FilooFiloo.Player, {name:"gyzmo", boardString: " rp "}));
      tickTimer();
    };
  }
});

test("Entering versus mode should force a login and start waiting for an opponent", function() {

  enterVersusMode();
  equals(FilooFiloo.loginController.get('loginPaneVisible'), YES, "Entering versus mode should display the login pane");

  FilooFiloo.loginController.set('name', 'zinzin');
  FilooFiloo.loginController.closeLoginPane();

  equals(versusController.get('gameStatus'), FilooFiloo.VersusController.WAITING, "Player should be waiting after login");
  ok(versusController.get('player'), "A player should have been created on login");
  equals(versusController.get('player').commitCalled, YES, "The player should have been commited on login");
  equals(versusController.get('player').refreshCalled, NO, "The player should have been refreshed after login");

  tickTimer();
  equals(versusController.get('player').refreshCalled, YES, "The player should be refreshed at each tick");

  versusController.get('player').set('opponent', store.createRecord(FilooFiloo.Player, {name:"gyzmo"}));
  tickTimer();
  equals(versusController.get('gameStatus'), FilooFiloo.VersusController.PLAYING, "The status should be playing once an opponent is found");
  equals(versusController.get('opponent').get('name'), "gyzmo", "The status should be playing once an opponent is found");
  equals(versusController.get('board').get('playing'), YES, "The board should be 'playing' once an opponent was found");
});

test("Waiting time should be incremented when waiting for an opponent", function() {

  FilooFiloo.loginController.set('name', 'zinzin');
  enterVersusMode();
  tickTimer();

  var oldWaitingTime = versusController.get('waitingTime');
  tickTimer();
  equals(versusController.get('waitingTime'), oldWaitingTime+1, "waiting time should be incremented at each tick");
});

test("No login dialog should be shown when entering versus mode with a name", function() {
  FilooFiloo.loginController.set('name', 'zinzin');
  enterVersusMode();
  equals(FilooFiloo.loginController.get('loginPaneVisible'), NO);
});

test("We should start waiting for an opponent even if a name was already set", function() {
  FilooFiloo.loginController.set('name', 'zinzin');
  enterVersusMode();
  equals(versusController.get('gameStatus'), FilooFiloo.VersusController.WAITING, "Player should be waiting after login");
});

test("We should only start waiting for an opponent in versus mode", function() {
  versusController.set('currentMode', 'FilooFiloo.highScorePage.mainView');
  equals(FilooFiloo.loginController.get('loginPaneVisible'), NO);
  ok(FilooFiloo.VersusController.PENDING, versusController.get('gameStatus'), "Status should be pending outside versus mode");
});

test("We should not try to start the game multiple times", function() {
  startAGame();
  versusController.get('player').set('opponent', store.createRecord(FilooFiloo.Player, {name:"gyzmo", boardString: " rp "}));
});

test("Once the game is started, the player should be commited regularly with a valid board", function() {
  startAGame();

  versusController.get('player').commitCalled = NO;
  tickTimer();
  ok(versusController.get('player').get('boardString'), "player should have a valid board");
  equals(versusController.get('player').commitCalled, YES, "the player should have been commited");
});

test("Once the game is started, the player should be updated regularly with the actual score", function() {
  startAGame();

  equals(versusController.get('player').get('score'), 0, "The score should be zero at start");
  versusController.get('board').set('score', 456);
  tickTimer();
  equals(versusController.get('player').get('score'), 456, "player should be updated with the score of the board");
});

test("Once the game is started, the opponent should be refreshed regularly", function() {
  startAGame();

  versusController.get('opponent').refreshCalled = NO;
  tickTimer();
  equals(versusController.get('opponent').refreshCalled, YES, "the opponent should have been refreshed");
});

test("The opponent board should be refreshed regularly", function() {
  ok(versusController.get('opponentBoard'), "opponent board should exist from the begining");

  startAGame();

  var oldBoardString = versusController.get('opponent').get('boardString');
  tickTimer();
  var newBoardString = versusController.get('opponent').get('boardString');
  ok(oldBoardString !== newBoardString, "The opponent's board should change at each tick previous '"+oldBoardString+"' current '"+newBoardString+"'");

  // how to test the binding to opponentBoard.boardString ?
  ok(versusController.boardStringBinding);
});

test("Player should not be commited if still BUSY", function() {
  startAGame();

  var player = versusController.get('player');
  player.commitCalled = NO;
  player.set('isEditable', NO);
  tickTimer();

  equals(NO, player.commitCalled, "layer should not be commited when busy");
});

test("When a player looses, the information should be sent to the server", function() {
  startAGame();

  var player = versusController.get('player');
  player.commitCalled = NO;
  versusController.get('board').set('gameOver', new Date());
  tickTimer();

  equals(player.get('outcome'), FilooFiloo.Player.LOST, "player should be flagged as 'lost' at gameOver");
  equals(player.commitCalled, YES, "player should be commited when loosing");
});

test("The game should end when the outcome of both players is known", function() {
  startAGame();

  versusController.get('player').set('outcome', FilooFiloo.Player.WIN);
  versusController.get('opponent').set('outcome', FilooFiloo.Player.LOST);
  tickTimer();

  equals(versusController.get('gameStatus'), FilooFiloo.VersusController.FINISHED);
  equals(versusController.get('timer').invalidateCalled, YES);
  equals(versusController.get('board').get('playing'), NO);
});

test("The score of the opponent should be converted to nasties in the board", function() {

  var nastiesCount = 0;
  versusController.get('board').addNasties = function(count) {
    nastiesCount = count;
  };

  startAGame();

  versusController.get('opponent').set('score', 50);
  tickTimer();
  equals(nastiesCount, 1, "1 nasty should be added for a chain worth 50 points");

  versusController.get('opponent').set('score', 50 + 210);
  tickTimer();
  equals(nastiesCount, 3, "3 nasties should be added for a chain worth 210 points");
});