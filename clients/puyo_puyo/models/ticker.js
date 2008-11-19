// ==========================================================================
// PuyoPuyo.Ticker
// ==========================================================================

require('core');

/** @class

  Metronomes for the game.

  @extends SC.Record
  @author Philou
  @version 0.1
*/
PuyoPuyo.Ticker = SC.Record.extend(
/** @scope PuyoPuyo.Ticker.prototype */ {

    /**
      Starts the game events.
    */
    start: function(game) {
	PuyoPuyo.assert(!this.timer);
	PuyoPuyo.assert(!this.game);
	PuyoPuyo.assert(game);

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
        return 1000 * Math.pow(0.9, level-1);
    }
});
