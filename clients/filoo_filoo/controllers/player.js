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

/** @class

 Represents the current player's attributes

 @extends SC.Object
 @author AuthorName
 @version 0.1
 @static
 */
FilooFiloo.createPlayerController = function() {
  return SC.Object.create(
    /** @scope FilooFiloo.playerController */ {

      /* current mode (single, versus ...)
       * corresponds to the current main tab
       */
      currentMode: undefined,

      /* Name of the current player
       */
      name: undefined,

      /*
       * Content of the login pane
       */
      loginPaneVisible: NO,
      loginTextRequired: YES,

      /*
       * Text in the login pane
       */
      loginTitle: 'Login',
      loginCaption: 'Please choose a surname.',
      _doAfterLogin: null,

      /*
       * What is the player doing now ?
       */
      whatIsPlayerDoing: 'nothing',

      /*
       * External refs
       */
      Timer: SC.Timer,
      Player: FilooFiloo.Player,

      forceLoginAndDo: function(loginTitle, loginCaption, doAfterLogin) {
	this.set('loginTitle', loginTitle);
	this.set('loginCaption', loginCaption);
	this._doAfterLogin = doAfterLogin;
	this.set('loginTextRequired', !this.get('name')); // this property is not bound to name dynamicaly, otherwise the
        // text box would disappear after the first entered letter
	this.set('loginPaneVisible', YES);
      },

      closeLoginPane: function() {
	if (this.get('name')) {
	  this.set('loginPaneVisible', NO);
	  this._doAfterLogin(this.get('name'));
	}
      },

      requestNameForVersusMode: function() {
        if ('versus' === this.get('currentMode')) {
	  if(!this.get('name')) {
	    this.forceLoginAndDo('Login', 'Filoo Filoo rules... you need to login in order to play against someone.',
				 this._startWaitingForOpponent);
	  } else {
	    this._startWaitingForOpponent();
	  }
	}
      }.observes('currentMode'),

      _startWaitingForOpponent: function() {
	this.set('whatIsPlayerDoing', 'Waiting for an opponent ...');

	this.player = this.Player.newRecord({name: this.name}, FilooFiloo.server);
	this.player.commit();

	this.ticks = 0;
	this.timer = this.Timer.schedule({target: this, action: '_checkForOpponent', repeats: YES, interval: 1000});
      },

      _checkForOpponent: function() {
	this.player.refresh();
	if (this.player.get('opponentName')) {
	  this.set('whatIsPlayerDoing', 'Playing against '+this.player.get('opponentName'));
	  this.timer.invalidate();
	} else {
	  this.ticks = this.ticks + 1;
	  this.set('whatIsPlayerDoing', 'Waiting for an opponent ... '+this.ticks+' seconds');
	}
      }
    }
  );
};

FilooFiloo.playerController = FilooFiloo.createPlayerController();
