// Copyright (c) 2008-2010  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.

// You should have received a copy of the MIT License along with this
// program.  If not, see <http://www.opensource.org/licenses/mit-license.php>

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
        var result = FilooFiloo.store.createRecord(klass, values);
	result.commitCalled = NO;
	result.commitRecord = function() {
	  result.commitCalled = YES;
        };
  	result.refreshCalled = NO;
	result.refresh = function() {
          result.refreshCalled = YES;
        };
        return result;
      }
    };

    versusController.store = store;

    versusController.Timer = {
      schedule: function(params) {
        var result = {
          parameters: params,
  	  invalidateCalled: NO,
          invalidate: function() {
  	     this.invalidateCalled = YES;
  	  }
        };
  	return result;
      }
    };
    tickTimer = function() {
      var timer = versusController.get('timer');
      ok(timer, "The timer should have been created");
      ok(timer.parameters, "The timer should have parameters");
      ok(timer.parameters.target, "The timer should have a target");
      ok(timer.parameters.action, "The timer should have an action");
      equals(YES, timer.parameters.repeats,"The timer should repeat");

      timer.parameters.target[timer.parameters.action]();
    };
    enterVersusMode = function() {
      versusController.set('currentMode', 'FilooFiloo.versusPage.mainView');
    };

    startAGame = function() {
      FilooFiloo.loginController.set('name', 'zinzin');
      enterVersusMode();

      versusController.get('player').set('opponent', store.createRecord(FilooFiloo.Player, {name:"gyzmo"}));
      tickTimer();
    };
  }
});

test("Entering versus mode should force a login and start waiting for an opponent", function() {

  enterVersusMode();
  equals(YES, FilooFiloo.loginController.get('loginPaneVisible'), "Entering versus mode should display the login pane");

  FilooFiloo.loginController.set('name', 'zinzin');
  FilooFiloo.loginController.closeLoginPane();

  equals(FilooFiloo.VersusController.WAITING, versusController.get('gameStatus'), "After login, player should be waiting");
  ok(versusController.get('player'), "A player should have been created on login");
  equals(YES, versusController.get('player').commitCalled, "The player should have been commited on login");
  equals(NO, versusController.get('player').refreshCalled, "The player should have been refreshed after login");

  tickTimer();
  equals(YES,versusController.get('player').refreshCalled, "The player should be refreshed at each tick");

  versusController.get('player').set('opponent', FilooFiloo.store.createRecord(FilooFiloo.Player, {name:"gyzmo"}));
  tickTimer();
  equals(FilooFiloo.VersusController.PLAYING, versusController.get('gameStatus'), "Once an opponent is found, the status should be playing");
  equals("gyzmo", versusController.get('opponent').get('name'), "Once an opponent is found, the status should be playing");
  equals(YES,versusController.get('board').get('playing'), "The board should be 'playing' once an opponent was found");
});

test("No login dialog should be shown when entering versus mode with a name", function() {
  FilooFiloo.loginController.set('name', 'zinzin');
  enterVersusMode();
  equals(NO,FilooFiloo.loginController.get('loginPaneVisible'));
});

test("We should start waiting for an opponent even if a name was already set", function() {
  FilooFiloo.loginController.set('name', 'zinzin');
  enterVersusMode();
  equals(FilooFiloo.VersusController.WAITING, versusController.get('gameStatus'), "After login, player should be waiting");
});

test("We should only start waiting for an opponent in versus mode", function() {
  versusController.set('currentMode', 'FilooFiloo.highScorePage.mainView');
  equals(NO,FilooFiloo.loginController.get('loginPaneVisible'));
  ok(FilooFiloo.VersusController.PENDING, versusController.get('gameStatus'), "Outside versus mode, status should be pending");
});

test("Once the game is started, the player should be commited regularly with a valid board", function() {
  startAGame();

  versusController.get('player').commitCalled = NO;
  tickTimer();
  ok(versusController.get('player').get('boardString'), "player should have a valid board");
  equals(YES, versusController.get('player').commitCalled, "the player should have been commited");
});

test("Once the game is started, the opponent should be refreshed regularly", function() {
  startAGame();

  versusController.get('opponent').refreshCalled = NO;
  tickTimer();
  equals(YES,versusController.get('opponent').refreshCalled, "the opponent should have been refreshed");
});

test("If a game stops, the player timer should be invalidated", function() {
  startAGame();

  versusController.get('board').abort();
  equals(YES,versusController.get('timer').invalidateCalled);
});
