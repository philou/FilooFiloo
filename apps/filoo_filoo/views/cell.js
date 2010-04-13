// ==========================================================================
// Project:   FilooFiloo - mainPage
// Copyright: ©2008-2010 Philippe Bourgau, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.
//
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.
//
// You should have received a copy of the MIT License along with this
// program. If not, see <http://www.opensource.org/licenses/mit-license.php>
//
// ==========================================================================
/*globals FilooFiloo */

sc_require('models/game');

/** @class

  (Document Your View Here)

  @extends SC.View
*/
FilooFiloo.createCellView = function(iCol, iRow) {

  return SC.View.extend(SC.ContentDisplay, {
  /** @scope FilooFiloo.BoardView.prototype */

    classNames: ['cell-view', 'cell'],

    tagName: 'div',

    contentDisplayProperties: ['playing', FilooFiloo.Board.cellProperty(iCol, iRow)],

    cellProperty: FilooFiloo.Board.cellProperty(iCol, iRow),

    render: function(context, firstTime)
    {
      var board = this.get('content');
      if (board) {
	context.addClass(FilooFiloo.Game.stateToName[board.get(this.cellProperty)]);
      }
      //sc_super(); no children
    }
  });
};
