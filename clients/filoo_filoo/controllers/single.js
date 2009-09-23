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
// FilooFiloo.GameController
// ==========================================================================

require('core');

/** @class

 @extends SC.Object
 @author Philou
 @version 0.1
 @static
 */
FilooFiloo.versusController = SC.Object.create(
  /** @scope FilooFiloo.versusController */ {

    board: FilooFiloo.Board.create(),

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
	FilooFiloo.versusController.forceLoginAndDo('Game Over', 'Filoo Filoo rules... but you somewhat managed to reach the '
						                 + 'high scores !', function(playerName) {
	  var values = {
	    "playerName": playerName,
            "score": that.get('board').get('score')
	  };

	  var score = FilooFiloo.HighScore.newRecord(values, FilooFiloo.server);
	  score.commit();
	});
      }
    }.observes('.board.gameOver')

  });
