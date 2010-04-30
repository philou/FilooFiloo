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

/** @class

  Common layout.

*/
FilooFiloo.Layout = {

  MAIN_VIEW: { top: 20, bottom: 0, centerX: 0, width: 300 },

  SCORE_ROW_HEIGHT: 24,
  scoreGridRowTop: function(i) {
    return i*this.SCORE_ROW_HEIGHT;
  },
  scoreGridHeight: function(count) {
    return count*this.SCORE_ROW_HEIGHT;
  },
  scoreRowLayout: function(i) {
    return { top: this.scoreGridRowTop(i), height: this.SCORE_ROW_HEIGHT, left: 0, right: 0 };
  },
  scoreItemViews: function(gridRowIndex, title, property) {
    return [
      SC.LabelView.design(
      {
	layout: this.scoreRowLayout(gridRowIndex),
	textAlign: SC.ALIGN_CENTER,
	fontWeight: SC.BOLD_WEIGHT,
	value: title
      }),
      SC.LabelView.design(
      {
	layout: this.scoreRowLayout(gridRowIndex+1),
	textAlign: SC.ALIGN_CENTER,
	fontWeight: SC.BOLD_WEIGHT,
	value: '0',
	valueBinding: property
      })];
  },
  scoreViews: function(boardProperty) {
    var result = [];
    result = result.concat(this.scoreItemViews(0, "Score", boardProperty+'.score'));
    result = result.concat(this.scoreItemViews(3, "Filoos", boardProperty+'.disappearedPieces'));
    result = result.concat(this.scoreItemViews(6, "Level", boardProperty+'.level'));
    return result;
  },

  detailedBoardView: function(boardProperty, positionLayout) {

    positionLayout.width = 321;
    positionLayout.height = 395;

    return SC.View.design(SC.Border,
    {
      classNames: ['main-view'],
      layout: positionLayout,
      borderStyle: SC.BORDER_GRAY,
      childViews: 'scoresView boardView'.w(),

      scoresView: SC.View.design(
      {
	classNames: ['scores'],
	layout: { left: 12, width: 100, centerY: 0, height: this.scoreGridHeight(8) },
	childViews: this.scoreViews()
      }),
      boardView: FilooFiloo.BoardView.design(
      {
	layout: { right: 12, centerY: 0, width: 185, height: 371 },
	contentBinding: boardProperty
      })
    });
  }

};
