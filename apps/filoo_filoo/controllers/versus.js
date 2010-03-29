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


// ==========================================================================
// FilooFiloo.PlayerController
// ==========================================================================

sc_require('models/player');
sc_require('models/board');

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


      /* mode (single, versus ...)
       * corresponds to the current main tab
       */
      currentMode: undefined,

      /*
       * Current status
       */
      gameStatus: FilooFiloo.VersusController.PENDING,

      /*
       * What is the player doing now ?
       */
      whatIsPlayerDoing: function() {
	if (this.get('opponent')) {
	  return "Playing against "+this.get('opponent').get('name');
	}
	else if (this.get('waitingTime')) {
	  return "Waiting for an opponent ... "+this.get('waitingTime')+" seconds";
	}
	else {
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
	this.set('gameStatus', FilooFiloo.VersusController.WAITING);

	this.set('player', this.store.createRecord(FilooFiloo.Player, {name: FilooFiloo.loginController.get('name')}));
	this.get('player').commitRecord();

	this.set('waitingTime', 0);
	this.set('timer', this.Timer.schedule({target: this, action: '_checkForOpponent', repeats: YES, interval: 1000}));
      },

      _checkForOpponent: function() {
	this.get('player').refresh();
	var opponent = this.get('player').get('opponent');
	if (opponent && opponent.get('name')) {
	  this.set('gameStatus', FilooFiloo.VersusController.PLAYING);
	  this.set('opponent', opponent);
	  this.get('timer').invalidate();
	  this._startPlaying();
	} else {
	  this.set('waitingTime', this.get('waitingTime') + 1);
	}
      },

      _startPlaying: function() {
	this.get('board').start();
	this.set('timer', this.Timer.schedule({target: this, action: '_updatePlayers', repeats: YES, interval: 3000}));
      },
      _updatePlayers: function() {
	var boardString = FilooFiloo.Board.boardToString(this.get('board'));
	this.get('player').set('boardString', boardString);

	this.get('player').commitRecord();
	this.get('player').get('opponent').refresh();
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
