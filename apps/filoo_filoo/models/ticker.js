// Copyright (c) 2008-2010  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.

// You should have received a copy of the MIT License along with this
// program.  If not, see <http://www.opensource.org/licenses/mit-license.php>


// ==========================================================================
// FilooFiloo.Ticker
// ==========================================================================

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
