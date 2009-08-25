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

  /* current mode (single, versus ...)
   * corresponds to the current main tab
   */
  currentMode: undefined,

  /* Name of the current player
   */
  name: undefined,

  /*
   * Text in the login pane
   */
  loginTitle: 'Login',
  loginCaption: 'Please choose a surname.',
  _doAfterLogin: null,

  forceLoginAndDo: function(loginTitle, loginCaption, doAfterLogin) {
    this.set('loginTitle', loginTitle);
    this.set('loginCaption', loginCaption);
    this._doAfterLogin = doAfterLogin;
    var gameOverPane = SC.page.get('loginPane');
    gameOverPane.get('requiredLoginText').set('isVisible', !this.get('name'));
    gameOverPane.set('isVisible', YES);
  },

  closeLoginPane: function() {
    if (this.get('name')) {
      SC.page.get('loginPane').set('isVisible', NO);
      this._doAfterLogin(this.get('name'));
    }
  },

  requestNameForVersusMode: function() {
    if( !this.get('name') && ('versus' === this.get('currentMode'))) {
      this.forceLoginAndDo('Login', 'Filoo Filoo rules... '
				    + 'you need to login in order to play against someone.', function() {});
    }
  }.observes('currentMode')

}) ;
