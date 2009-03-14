// ==========================================================================
// PuyoPuyo.GameController
// ==========================================================================

require('core');

/** @class

 @extends SC.Object
 @author Philou
 @version 0.1
 @static
 */
PuyoPuyo.gameController = SC.Object.create(
  /** @scope PuyoPuyo.gameController */ {

    startStopLabel: 'Play !',

    playing: function() {
      return this.get('board') && this.get('board').get('playing');
    }.property('board', '.board.playing'),

    // it would have been nicer to define startStopLabel as a function property
    updateStartStopLabel: function() {
      if (this.get('playing')) {
        this.set('startStopLabel', 'Give up ...');
      } else {
        this.set('startStopLabel', 'Play !');
      }
    }.observes('.board.playing'),

    startStop: function() {
      if (!this.get('playing')) {
        this.get('board').start();
      } else {
        this.get('board').abort();
      }
    },

    gameOver: function() {
      if (this.get('board').get('gameOver')) {
	var that = this;
	PuyoPuyo.playerController.requestNameAfterGameOver(function(playerName) {
	  var values = {
	    "playerName": playerName,
            "score": that.get('board').get('score')
	  };

	  var score = PuyoPuyo.HighScore.newRecord(values, PuyoPuyo.server);
	  score.commit();
	    });
	}
    }.observes('.board.gameOver')

  });
