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
       * What is the player doing now ?
       */
      whatIsPlayerDoing: 'nothing',

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
	this.set('whatIsPlayerDoing', 'Waiting for an opponent ...');

	this.player = this.store.createRecord(FilooFiloo.Player, {name: FilooFiloo.loginController.get('name')});
	this.player.commitRecord();

	this.ticks = 0;
	this.waitTimer = this.Timer.schedule({target: this, action: '_checkForOpponent', repeats: YES, interval: 1000});
      },

      _checkForOpponent: function() {
	this.player.refresh();
	if (this.player.get('opponentName')) {
	  this.set('whatIsPlayerDoing', 'Playing against '+this.player.get('opponentName'));
	  this.waitTimer.invalidate();
	  this._startPlaying();
	} else {
	  this.ticks = this.ticks + 1;
	  this.set('whatIsPlayerDoing', 'Waiting for an opponent ... '+this.ticks+' seconds');
	}
      },

      _startPlaying: function() {
	this.get('board').start();
	this.playerTimer = this.Timer.schedule({target: this, action: '_commitPlayer', repeats: YES, interval: 3000});
      },
      _commitPlayer: function() {
	var boardString = FilooFiloo.Board.boardToString(this.get('board'));
	this.player.set('boardString', boardString);
	this.player.commitRecord();
      },
      playingObserver: function() {
	if (!this.get('board').get('playing')) {
	  if (this.waitTimer) {
	    this.waitTimer.invalidate();
	  }
	  if (this.playerTimer) {
	    this.playerTimer.invalidate();
	  }
	}
      }.observes('.board.playing')
    }
  );
};

FilooFiloo.versusController = FilooFiloo.createVersusController();
