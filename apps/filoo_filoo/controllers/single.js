// Copyright (c) 2008-2010  Philippe Bourgau

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
// FilooFiloo.GameController
// ==========================================================================

sc_require('models/board');
sc_require('models/high_score');

/** @class

 @extends SC.Object
 @author Philou
 @version 0.1
 @static
 */
FilooFiloo.singleController = SC.Object.create(
  /** @scope FilooFiloo.singleController */ {

    board: FilooFiloo.Board.create(),

    gameOver: function() {
      if (this.get('board').get('gameOver')) {
	var that = this;
	FilooFiloo.loginController.forceLoginAndDo('Game Over', 'Filoo Filoo rules... but you somewhat managed to reach the '
						                 + 'high scores !', function(playerName) {
	  var values = {
	    "playerName": playerName,
            "score": that.get('board').get('score')
	  };

	  var score = FilooFiloo.store.createRecord(FilooFiloo.HighScore, values);
	  score.commitRecord();
	});
      }
    }.observes('.board.gameOver'),

    currentModeObserver: function() {
      var board = this.get('board');
      if (('FilooFiloo.singlePage.mainView' === this.get('currentMode')) && (!board.get('playing'))) {

	// start must be invoked only after the board view is visible, otherwise it would not take the
	// focus automaticaly
	board.invokeLast('start');
      } else if(board.get('playing')) {
	board.abort();
      }
    }.observes('currentMode'),

    nowShowingObserver: function() {
      this.set('currentMode', FilooFiloo.menuController.get('nowShowing'));
    }.observes('FilooFiloo.menuController.nowShowing')

  });
