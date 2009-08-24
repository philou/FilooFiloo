// ==========================================================================
// FilooFiloo.PlayerController
// ==========================================================================

require('core');

/** @class

  Represents the current player's attributes

  @extends SC.Object
  @author AuthorName
  @version 0.1
  @static
*/
FilooFiloo.playerController = SC.Object.create(
/** @scope FilooFiloo.playerController */ {

  name: undefined,

  _closeGameOverPaneContinuation: null,

  requestNameAfterGameOver: function(closeGameOverPaneContinuation) {
    this._closeGameOverPaneContinuation = closeGameOverPaneContinuation;
    var gameOverPane = SC.page.get('gameOverPane');
    gameOverPane.get('requiredLoginText').set('isVisible', !this.get('name'));
    gameOverPane.set('isVisible', YES);
  },

  closeGameOverPane: function() {
    if (this.get('name')) {
      SC.page.get('gameOverPane').set('isVisible', NO);
      this._closeGameOverPaneContinuation(this.get('name'));
    }
  }
}) ;
