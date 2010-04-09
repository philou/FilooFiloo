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
FilooFiloo.CellView = SC.View.extend(SC.ContentDisplay, {
/** @scope FilooFiloo.BoardView.prototype */

  classNames: ['cell-view', 'cell'],

  tagName: 'div',

  contentDisplayProperties: 'time playing'.w(),

  /** Virtual properties to be specified when specialized */
  row: 0,
  col: 0,

  previousState: FilooFiloo.Game.Clear,

  render: function(context, firstTime)
  {
    var previousState = this.get('previousState');
    var currentState = previousState;
    var board = this.get('content');

    if (board) {
      currentState = board.cellState(this.get('col'), this.get('row'));
    }

    if (firstTime || (previousState != currentState)) {
      var classes = {};
      classes[FilooFiloo.Game.stateToName[previousState]] = NO;
      classes[FilooFiloo.Game.stateToName[currentState]] = YES;
      context.setClass(classes);
    }

    //sc_super(); no children
  }

});
