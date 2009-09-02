// ==========================================================================
// FilooFiloo.PlayerController
// ==========================================================================

require('core');
require('models/player');

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

  /*
   * What is the player doing now ?
   */
  whatIsPlayerDoing: 'nope',

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
      this.forceLoginAndDo('Login', 'Filoo Filoo rules... you need to login in order to play against someone.',
			   this.startWaitingForOpponent);
    } else {
      this.startWaitingForOpponent();
    }
  }.observes('currentMode'),

  startWaitingForOpponent: function() {
    this.set('whatIsPlayerDoing', 'Waiting for an opponent ...');

    this.player = FilooFiloo.Player.newRecord({name: this.name}, FilooFiloo.server);
    this.player.commit();

    this.ticks = 0;
    this.timer = SC.Timer.schedule({
      target: this, action: 'checkForOpponent', repeats: YES, interval: 1000});
  },

  checkForOpponent: function() {
    this.player.refresh();
    if (this.player.get('opponentName')) {
      this.set('whatIsPlayerDoing', 'Playing against '+this.player.get('opponentName'));
      this.timer.invalidate();
    } else {
      this.ticks = this.ticks + 1;
      this.set('whatIsPlayerDoing', 'Waiting for an opponent ... '+this.ticks+' seconds');
    }
  }

}) ;
