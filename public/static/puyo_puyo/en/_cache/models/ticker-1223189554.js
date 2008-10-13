/* Start ----------------------------------------------------- models/ticker.js*/

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
	    target: this.game, action: 'tick', repeats: YES, interval: 1000
	});
    },

    /**
      Stops the game events.
    */
    stop: function() {
	PuyoPuyo.assert(this.game);
	PuyoPuyo.assert(this.timmer);

	this.timer.invalidate();
	delete(this.timer);
	delete(this.game);
    },

}) ;


/* End ------------------------------------------------------- models/ticker.js*/

