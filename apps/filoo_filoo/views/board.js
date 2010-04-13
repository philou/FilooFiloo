// ==========================================================================
// Project:   FilooFiloo - mainPage
// Copyright: ©2008-2010 Philippe Bourgau, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>
//
// ==========================================================================
/*globals FilooFiloo */

sc_require('views/cell');

/** @class

  (Document Your View Here)

  @extends SC.View
*/
FilooFiloo.BoardView = SC.View.extend({
/** @scope FilooFiloo.BoardView.prototype */

  classNames: ['board-view'],

  acceptsFirstResponder: YES,

  childViews: function() {

    var result = [];

    for (var col = 0; col < FilooFiloo.Board.ColCount; col++) {
      for (var row = 0; row < FilooFiloo.Board.RowCount; row++) {
	var cell = FilooFiloo.createCellView(col, row).design(
	{
	  layout: { width: 30, height: 30, left: 31*col, top: 31*row }
	});
	result.push(cell);
      }
    }

    return result;
  }(),

  contentObserver: function() {

    var board = this.get('content');
    var childViews = this.get('childViews');
    var len = childViews.length;

    for(var i = 0; i < len; i++) {
      childViews[i].set('content', board);
    }

  }.observes('content'),

  /** Intercept key strokes when the game is playing. */
  focus: function() {
    var board = this.get('content');
    if(board && board.get('playing')) {
      this.becomeFirstResponder();
    } else {
      this.resignFirstResponder();
    }
  }.observes('content', '.content.playing'),

  // key handling methods
  keyDown: function(evt) {
    return this.interpretKeyEvents(evt) ;
  },
  moveRight: function(sender, evt) {
    this.get('content').right();
    return true;
  },
  moveLeft: function(sender, evt) {
    this.get('content').left();
    return true;
  },
  moveUp: function(sender, evt) {
    this.get('content').rotate();
    return true;
  },
  moveDown: function(sender, evt) {
    this.get('content').antiRotate();
    return true;
  },
  insertText: function(chr) {
    if (" " === chr) {
      this.get('content').drop();
      return true;
    }
    return false;
  }

});
