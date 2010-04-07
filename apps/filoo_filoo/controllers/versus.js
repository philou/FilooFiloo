// Copyright (c) 2008-2009  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.

// You should have received a copy of the MIT License along with this
// program.  If not, see <http://www.opensource.org/licenses/mit-license.php>


// ==========================================================================
// FilooFiloo.PlayerController
// ==========================================================================

sc_require('models/player');
sc_require('models/board');
sc_require('models/read_only_board');

FilooFiloo.VersusController = {
  PENDING: "pending",
  WAITING: "waiting for opponent",
  PLAYING: "playing"
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
	if (this.get('opponent')) {
	  return FilooFiloo.VersusController.PLAYING;
	}
	else if (undefined != this.get('waitingTime')) { // 0 evals to false ...
	  return FilooFiloo.VersusController.WAITING;
	}
	else {
	  return FilooFiloo.VersusController.PENDING;
	}
      }.property('opponent','waitingTime'),


      /*
       * What is the player doing now ?
       */
      whatIsPlayerDoing: function() {
	switch(this.get('gameStatus'))
	{
	case FilooFiloo.VersusController.PLAYING:
	  return "Playing against "+this.get('opponent').get('name');
	case FilooFiloo.VersusController.WAITING:
	  return "Waiting for an opponent ... "+this.get('waitingTime')+" seconds";
	default:
	  return "pending";
	}
      }.property('opponent','waitingTime'),

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
	  this.set('opponent', opponent);
	  this.get('timer').set('interval',3000);
	  this.get('timer').set('action','_updatePlayers');
	  this.get('board').start();
	  this.removeObserver('player.opponent', this, 'playerOpponentObserver');
	}
      },

      _updatePlayers: function() {
	var boardString = FilooFiloo.Board.boardToString(this.get('board'));
	this.get('player').set('boardString', boardString);

	this.get('player').commitRecord();
	this.get('opponent').refresh();

	// maybe replace this by a binding ?
	var opponentBoardString = this.get('opponent').get('boardString');
	this.get('opponentBoard').set('boardString', opponentBoardString);
      },
      playingObserver: function() {
	if (!this.get('board').get('playing')) {
	  if (this.get('timer')) {
	    this.get('timer').invalidate();
	  }
	  this.set('opponent', undefined);
	  this.set('waitingTime', undefined);
	}
      }.observes('.board.playing')
    }
  );
};

FilooFiloo.versusController = FilooFiloo.createVersusController();
