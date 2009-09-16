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
// FilooFiloo.Ticker
// ==========================================================================

require('core');

/** @class

  Metronomes for the game.

  @extends SC.Record
  @author Philou
  @version 0.1
*/
FilooFiloo.Ticker = SC.Record.extend(
/** @scope FilooFiloo.Ticker.prototype */ {

    /**
      Starts the game events.
    */
    start: function(game) {
	FilooFiloo.assert(!this.timer);
	FilooFiloo.assert(!this.game);
	FilooFiloo.assert(game);

	this.game = game;
	this.timer = SC.Timer.schedule({
	    target: this.game, action: 'tick', repeats: YES, interval: this.interval_(game.get('level'))
	});
    },

    /**
      Stops the game events.
    */
    stop: function() {
	this.timer.invalidate();
	delete(this.timer);
	delete(this.game);
    },

    /**
      Changes the speed of the game.
    */
    setLevel: function(level) {
        if (this.timer) {
            this.timer.set('interval', this.interval_(level));
        }
    },

    // Time interval between tick at the given level
    interval_: function(level) {
        return FilooFiloo.Game.StartTickerInterval * Math.pow(FilooFiloo.Game.LevelAcceleration, level-1);
    }
});
