// ==========================================================================
// PuyoPuyo.PlayerController
// ==========================================================================

require('core');

/** @class

  @extends SC.Object
  @author Philou
  @version 0.1
  @static
*/
PuyoPuyo.playerController = SC.Object.create(
/** @scope PuyoPuyo.playerController */ {

    start: function() {
	this.get('board').start();
    },

    abort: function() {
	this.get('board').abort();
    },

    openGameOverDialog: function() {
        if (this.get('board').get('gameOver'))
            SC.page.get('gameOverPane').set('isVisible', YES);
    }.observes('.board.gameOver'),

    closeGameOverDialog: function() {
        SC.page.get('gameOverPane').set('isVisible', NO);
    }
    
}) ;
