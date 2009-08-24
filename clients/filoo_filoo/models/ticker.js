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
