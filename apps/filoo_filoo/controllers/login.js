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
// FilooFiloo.LoginController
// ==========================================================================

/** @class

  (Document Your View Here)

  @extends SC.Object
  @author AuthorName
  @version 0.1
  @static
*/
FilooFiloo.createLoginController = function() {
  return SC.Object.create(
  /** @scope FilooFiloo.loginController */ {

    /* Name of the current player
     */
    name: undefined,

    /*
     * Content of the login pane
     */
    loginPaneVisible: NO,
    loginTextRequired: YES,

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
      // loginTextRequired is not bound to name dynamicaly, otherwise the
      // text box would disappear after the first entered letter
      this.set('loginTextRequired', !this.get('name'));
      this.set('loginPaneVisible', YES);
    },

    closeLoginPane: function() {
      if (this.get('name')) {
	this.set('loginPaneVisible', NO);
	this._doAfterLogin(this.get('name'));
      }
    },

    // login pane visible self made binding
    loginPaneVisibleDidChange: function() {
      var loginPane = FilooFiloo.mainPage.get('loginPane');
      if (this.get('loginPaneVisible')) {
	loginPane.append();
      }
      else {
	loginPane.remove();
      }
    }
  });
};

FilooFiloo.loginController = FilooFiloo.createLoginController();
FilooFiloo.loginController.addObserver('loginPaneVisible', FilooFiloo.loginController, 'loginPaneVisibleDidChange');