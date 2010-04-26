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

      /**
       * Current player's board.
       */
      board: FilooFiloo.Board.create(),

      /**
       * Opponent's board.
       */
      opponentBoard: FilooFiloo.ReadOnlyBoard.create(),

      /* mode (single, versus ...)
       * corresponds to the current main tab
       */
      currentMode: undefined,

      /*
       * Current status
       */
      gameStatus: function() {
	var opponent = this.get('opponent');
	if (opponent && opponent.get('outcome')) {
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
      }.property('opponent','waitingTime','opponentOutcome'),


      /*
       * What is the player doing now ?
       */
      whatIsPlayerDoing: function() {
	switch(this.get('gameStatus'))
	{
	case FilooFiloo.VersusController.FINISHED:
	  return this.outcomeToString(this.get('player').get('outcome'))+" against "+this.get('opponent').get('name');
	case FilooFiloo.VersusController.PLAYING:
	  return "Playing against "+this.get('opponent').get('name');
	case FilooFiloo.VersusController.WAITING:
	  return "Waiting for an opponent ... "+this.get('waitingTime')+" seconds";
	default:
	  return "pending";
	}
      }.property('gameStatus'),

      /*
       * What is the opponent doing now ?
       */
      whatIsOpponentDoing: function() {
	switch(this.get('gameStatus'))
	{
	case FilooFiloo.VersusController.FINISHED:
	  return this.outcomeToString(this.get('opponent').get('outcome'))+" against "+this.get('player').get('name');
	case FilooFiloo.VersusController.PLAYING:
	  return "Playing against "+this.get('player').get('name');
	default:
	  return "";
	}
      }.property('gameStatus'),

      outcomeToString: function(outcome) {
	switch(outcome) {
	case FilooFiloo.Player.WIN:
	  return "Won";
	case FilooFiloo.Player.LOST:
	  return "Lost";
	default:
	  return "Unexpected outcome";
	}
      },

      /*
       * External refs
       */
      Timer: SC.Timer,
      store: FilooFiloo.store,

      currentModeObserver: function() {
        if ('FilooFiloo.versusPage.mainView' === this.get('currentMode')) {
	  this.requestLogin();
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
	  this.outcomeBinding = SC.Binding.from('opponent.outcome', this).to('opponentOutcome', this).connect();

	  this.set('opponentScore', 0);
	  this.addObserver('opponent.score', this, 'opponentScoreObserver');
	}
      },

      _updatePlayers: function() {
	var player = this.get('player');
	var opponent = this.get('opponent');

	if (player.get('outcome') && opponent.get('outcome')) {
	  this.stopTheGame();
	  return;
	}

	// TODO remplace ça par des bindings ? ça éviterait de faire un cas pour le isEditable
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

	this.removeObserver('player.opponent', this, 'playerOpponentObserver');

	if (this.boardStringBinding) {
	  this.boardStringBinding.disconnect();
	  delete this.boardStringBinding;
	}

	if (this.outcomeBinding) {
	  this.outcomeBinding.disconnect();
	  delete this.outcomeBinding;
	}

	this.removeObserver('opponent.score', this, 'opponentScoreObserver');

	var board = this.get('board');
	if (board && board.get('playing')) {
	  board.abort();
	}
      }

      // ajouter une observer sur le score de l'adversaire, faire la diff avec ce qui
      // a été géré avant, et envoyer le compte de saletés à la board.
    }
  );
};

FilooFiloo.versusController = FilooFiloo.createVersusController();
