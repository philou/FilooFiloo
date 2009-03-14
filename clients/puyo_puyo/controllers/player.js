// ==========================================================================
// PuyoPuyo.PlayerController
// ==========================================================================

require('core');

/** @class

  Represents the current player's attributes

  @extends SC.Object
  @author AuthorName
  @version 0.1
  @static
*/
PuyoPuyo.playerController = SC.Object.create(
/** @scope PuyoPuyo.playerController */ {

  name: 'anonymous',

  _closeGameOverPaneContinuation: null,

  requestNameAfterGameOver: function(closeGameOverPaneContinuation) {
    this._closeGameOverPaneContinuation = closeGameOverPaneContinuation;
    SC.page.get('gameOverPane').set('isVisible', YES);
  },

  closeGameOverPane: function() {
    SC.page.get('gameOverPane').set('isVisible', NO);
    this._closeGameOverPaneContinuation(this.get('name'));
  }
}) ;
