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

module("FilooFiloo.VersusController",{

  setup: function()  {
    FilooFiloo.loginController = FilooFiloo.createLoginController();
    versusController = FilooFiloo.createVersusController();

    player = null;
    waitTimer = null;
    playerTimer = null;

    versusController.store = {
      createRecord: function(klass, values) {
        var result = FilooFiloo.store.createRecord(klass, values);
	result.commitCalled = NO;
	result.commit = function() {
	  result.commitCalled = YES;
        };
  	result.refreshCalled = NO;
	result.refresh = function() {
          result.refreshCalled = YES;
        };
	if (FilooFiloo.Player === klass) {
	  player = result;
	}
        return result;
      }
    };

    versusController.Timer = {
      schedule: function(params) {
        var result = {
          parameters: params,
  	  invalidateCalled: NO,
          invalidate: function() {
  	     this.invalidateCalled = YES;
  	  }
        };
        if (!waitTimer) {
          waitTimer = result;
        }
        else {
          playerTimer = result;
        }
  	return result;
      }
    };
    tickTimer = function(timer) {
      ok(timer);
      ok(timer.parameters);
      ok(timer.parameters.target);
      ok(timer.parameters.action);
      equals(YES, timer.parameters.repeats);

      timer.parameters.target[timer.parameters.action]();
    };
    tickWaitTimer = function() {
      tickTimer(waitTimer);
    };
    tickPlayerTimer = function() {
      tickTimer(playerTimer);
    };

    enterVersusMode = function() {
      versusController.set('currentMode', 'FilooFiloo.versusPage.mainView');
    };

    startAGame = function() {
      FilooFiloo.loginController.set('name', 'zinzin');
      enterVersusMode();

      player.set('opponentName', 'gyzmo');
      tickWaitTimer();
    };
  }
});

test("Entering versus mode should force a login and start waiting for an opponent", function() {

  enterVersusMode();
  equals(YES,FilooFiloo.loginController.get('loginPaneVisible'));

  FilooFiloo.loginController.set('name', 'zinzin');
  FilooFiloo.loginController.closeLoginPane();

  equals('Waiting for an opponent ...', versusController.get('whatIsPlayerDoing'));
  ok(player);
  equals(YES,player.commitCalled);
  equals(NO,player.refreshCalled);

  tickWaitTimer();
  equals(YES,player.refreshCalled);

  player.set('opponentName', 'gyzmo');
  tickWaitTimer();
  equals('Playing against gyzmo', versusController.get('whatIsPlayerDoing'));
  equals(YES,versusController.get('board').get('playing'));
});

test("No login dialog should be shown when entering versus mode with a name", function() {
  FilooFiloo.loginController.set('name', 'zinzin');
  enterVersusMode();
  equals(NO,FilooFiloo.loginController.get('loginPaneVisible'));
});

test("We should start waiting for an opponent even if a name was already set", function() {
  FilooFiloo.loginController.set('name', 'zinzin');
  enterVersusMode();
  equals('Waiting for an opponent ...',versusController.get('whatIsPlayerDoing'));
});

test("We should only start waiting for an opponent in versus mode", function() {
  versusController.set('currentMode', 'FilooFiloo.highScorePage.mainView');
  equals(NO,FilooFiloo.loginController.get('loginPaneVisible'));
  ok('Waiting for an opponent ...' != versusController.get('whatIsPlayerDoing'));
});

test("Once the game is started, the player should be commited regularly with a valid board", function() {
  startAGame();

  player.commitCalled = NO;
  tickPlayerTimer();
  ok(player.get('boardString'));
  equals(YES,player.commitCalled);
});

test("If a game stops, the player timer should be invalidated", function() {
  startAGame();

  versusController.get('board').abort();
  equals(YES,playerTimer.invalidateCalled);
}) ;
