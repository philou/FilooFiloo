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
	this.timer = this.Timer.schedule({target: this, action: '_checkForOpponent', repeats: YES, interval: 1000});
      },

      _checkForOpponent: function() {
	this.player.refresh();
	if (this.player.get('opponentName')) {
	  this.set('whatIsPlayerDoing', 'Playing against '+this.player.get('opponentName'));
	  this.timer.invalidate();
	  this.get('board').start();
	} else {
	  this.ticks = this.ticks + 1;
	  this.set('whatIsPlayerDoing', 'Waiting for an opponent ... '+this.ticks+' seconds');
	}
      }
    }
  );
};

FilooFiloo.versusController = FilooFiloo.createVersusController();
