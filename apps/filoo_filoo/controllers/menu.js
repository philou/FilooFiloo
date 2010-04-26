// ==========================================================================
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

/** @class

 Controller responsible for moving between the different game views and modes.

*/
FilooFiloo.menuController = SC.ObjectController.create(
/** @scope FilooFiloo.menuController.prototype */ {

  /** View being displayed in the main panel */
  nowShowing: 'FilooFiloo.menuPage.mainView',

  /** Functions to navigate through the different views */
  singleGame: function() {
    this.setNowShowing('single');
  },
  versusGame: function() {
    this.setNowShowing('versus');
  },
  highScores: function() {
    this.setNowShowing('highScores');
  },
  rules: function() {
    this.setNowShowing('rules');
  },
  credits: function() {
    this.setNowShowing('credits');
  },

  backToMenu: function() {
    this.setNowShowing('menu');
  },

  /** helper method to change the now showing view */
  setNowShowing: function(page) {
    this.set('nowShowing', 'FilooFiloo.'+page+'Page.mainView');
  }

}) ;
