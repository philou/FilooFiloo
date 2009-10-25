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

require('core');
require('models/player');
require('models/board');

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
      Player: FilooFiloo.Player,

      currentModeObserver: function() {
        if ('versus' === this.get('currentMode')) {
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

	this.player = this.Player.newRecord({name: FilooFiloo.loginController.get('name')}, FilooFiloo.server);
	this.player.commit();

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
	this.player.commit();
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
