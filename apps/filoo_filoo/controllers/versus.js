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
// FilooFiloo.PlayerController
// ==========================================================================

sc_require('models/player');
sc_require('models/board');
sc_require('models/read_only_board');
sc_require('controllers/menu');

FilooFiloo.VersusController = {
  PENDING: "pending",
  WAITING: "waiting for opponent",
  PLAYING: "playing",
  FINISHED: "finished"
};

/** @class

 Represents the current player's attributes

 @extends SC.Object
 @author AuthorName
 @version 0.1
 @static
 */
FilooFiloo.createVersusController = function() {
  return SC.Object.create(
    /** @scope FilooFiloo.versusController */ {

      /** Current player's board. */
      board: FilooFiloo.Board.create(),

      /** Opponent's board. */
      opponentBoard: FilooFiloo.ReadOnlyBoard.create(),

      /* mode (single, versus ...)
       * corresponds to the current main tab
       */
      currentMode: undefined,

      /** Record sent to the server with the game state */
      player: undefined,

      /** Record received from the server with the opponent's game state */
      opponent: undefined,

      /** Time waiting for an opponent */
      waitingTime: undefined,

      /** Score of the opponent, used to know how many junk we have to handle */
      opponentScore: undefined,

      /** Timer responsible for the client server synchronization */
      timer: undefined,

      /*
       * External refs
       */
      Timer: SC.Timer,
      store: FilooFiloo.store,

      /*
       * Current status
       */
      gameStatus: function() {
	var player = this.get('player');
	var opponent = this.get('opponent');
	if ((player && player.get('outcome')) || (opponent && opponent.get('outcome'))) {
	  return FilooFiloo.VersusController.FINISHED;
	}
	else if (opponent) {
	  return FilooFiloo.VersusController.PLAYING;
	}
	else if (undefined != this.get('waitingTime')) { // 0 evals to false ...
	  return FilooFiloo.VersusController.WAITING;
	}
	else {
	  return FilooFiloo.VersusController.PENDING;
	}
      }.property('waitingTime','opponent','opponentOutcome','player','playerOutcome'),


      /*
       * What is the player doing now ?
       */
      whatIsPlayerDoing: function() {
	switch(this.get('gameStatus'))
	{
	case FilooFiloo.VersusController.FINISHED:
	  var opponent = this.get('opponent');
	  if (!opponent) {
	    return "Could not find any opponent, try again later !";
	  }
	  else {
	    return this.outcomeToString()+" against "+this.get('opponent').get('name');
	  }
	case FilooFiloo.VersusController.PLAYING:
	  return "Playing against "+this.get('opponent').get('name');
	case FilooFiloo.VersusController.WAITING:
	  return "Waiting for an opponent ... "+this.get('waitingTime')+" seconds";
	default:
	  return "pending";
	}
      }.property('gameStatus'),

      whatIsPlayerDoingPaneVisible: function() {
	if (this.get('currentMode') != 'FilooFiloo.versusPage.mainView') {
	  return NO;
	}

	switch(this.get('gameStatus'))
	{
	case FilooFiloo.VersusController.WAITING:
	case FilooFiloo.VersusController.FINISHED:
	  return YES;
	default:
	  return NO;
	}
      }.property('gameStatus'),

      outcomeToString: function() {
	switch(this.get('opponentOutcome')) {
	case FilooFiloo.Player.TIMEOUT:
	  return "Timeout";
	case FilooFiloo.Player.LOST:
	  return "Won";
	default:
	  return "Lost";
	}
      },

      currentModeObserver: function() {
	var player = this.get('player');
        if ('FilooFiloo.versusPage.mainView' === this.get('currentMode')) {
	  this.requestLogin();
	}
	else if (player) {
	  player.set('outcome', FilooFiloo.Player.TIMEOUT);
	  player.commitRecord();
	  this.stopTheGame();
	  this.reset();
	}
      }.observes('currentMode'),

      // nowShowing is forwarded to currentMode so that it can be overriden while testing
      nowShowingObserver: function() {
	this.set('currentMode', FilooFiloo.menuController.get('nowShowing'));
      }.observes('FilooFiloo.menuController.nowShowing'),

      requestLogin: function() {
	if(!FilooFiloo.loginController.get('name')) {
	  var that = this;
	  FilooFiloo.loginController.forceLoginAndDo('Login', 'Filoo Filoo rules... you need to login in order to play against someone.',
						     function() { that._startWaitingForOpponent(); });
	} else {
	  this._startWaitingForOpponent();
	}
      },

      _startWaitingForOpponent: function() {
	this.set('player', this.store.createRecord(FilooFiloo.Player, {name: FilooFiloo.loginController.get('name')}));
	this.playerOutcomeBinding = SC.Binding.from('player.outcome', this).to('playerOutcome', this).connect();
	this.get('player').commitRecord();

	this.set('waitingTime', 0);
	this.set('timer', this.Timer.schedule({target: this, action: '_checkForOpponent', repeats: YES, interval: 1000}));
	this.addObserver('player.opponent', this, 'playerOpponentObserver');
      },

      _checkForOpponent: function() {
	this.incrementProperty('waitingTime');
	this.get('player').refresh();
      },

      playerOpponentObserver: function() {
	var opponent = this.get('player').get('opponent');
	if (opponent && opponent.get('name')) {
	  this.removeObserver('player.opponent', this, 'playerOpponentObserver');
	  this.set('opponent', opponent);
	  this.get('timer').set('interval',3131);
	  this.get('timer').set('action','_updatePlayers');
	  this.get('board').start();

	  this.boardStringBinding = SC.Binding.from('opponent.boardString', this).to('opponentBoard.boardString', this).connect();
	  this.opponentOutcomeBinding = SC.Binding.from('opponent.outcome', this).to('opponentOutcome', this).connect();

	  this.set('opponentScore', 0);
	  this.addObserver('opponent.score', this, 'opponentScoreObserver');
	}
      },

      _updatePlayers: function() {
	var opponent = this.get('opponent');
	if (opponent.get('outcome')) {
	  this.stopTheGame();
	  return;
	}

	// TODO remplace ça par des bindings ? ça éviterait de faire un cas pour le isEditable
	var player = this.get('player');
	if (player.get('isEditable')) {

	  player.set('boardString', this.get('board').cellsToString());
	  player.set('score', this.get('board').get('score'));

	  if (this.get('board').get('gameOver')) {
	    player.set('outcome', FilooFiloo.Player.LOST);
	  }

	  player.commitRecord();
	}

	opponent.refresh();
      },

      opponentScoreObserver: function() {

	var newScore = this.get('opponent').get('score');
	var extraScore = newScore - this.get('opponentScore');

	this.get('board').addJunk(Math.ceil(extraScore/70));
	this.set('opponentScore', newScore);
      },

      stopTheGame: function() {
	if (this.get('timer')) {
	  this.get('timer').invalidate();
	}

	var that = this;
	["boardStringBinding","playerOutcomeBinding","opponentOutcomeBinding"].forEach(function(bindingName) {
	  if (that[bindingName]) {
	    that[bindingName].disconnect();
	    delete that[bindingName];
	  };
	});
	this.removeObserver('opponent.score', this, 'opponentScoreObserver');
	this.removeObserver('player.opponent', this, 'playerOpponentObserver');

	var board = this.get('board');
	if (board.get('playing')) {
	  board.abort();
	}
      },
      reset: function() {
	var that = this;
	['timer','player','opponent','waitingTime','opponentScore'].forEach(function(property) {
	  that.set(property, undefined);
	});
      },

      whatIsPlayerDoingPaneVisibleDidChange: function() {
	var pane = FilooFiloo.versusPage.get('whatIsPlayerDoingPane');
	if (this.get('whatIsPlayerDoingPaneVisible')) {
	  pane.append();
	}
	else {
	  pane.remove();
	}
      }
    }
  );
};

FilooFiloo.versusController = FilooFiloo.createVersusController();
FilooFiloo.versusController.addObserver('whatIsPlayerDoingPaneVisible', FilooFiloo.versusController, 'whatIsPlayerDoingPaneVisibleDidChange');
