// ==========================================================================
// Project:   FilooFiloo - rules page
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

FilooFiloo.MenuPage = {
  MARGIN: 12,
  CELL_HEIGHT: 24,
  gridTop: function(index) {
    return this.gridHeight(index);
  },
  gridHeight: function(itemsCount) {
    return this.MARGIN+(this.CELL_HEIGHT+this.MARGIN)*itemsCount;
  },
  cellLayout: function(index) {
    return { top: this.gridTop(index), height: this.CELL_HEIGHT, left: this.MARGIN, right: this.MARGIN };
  }
};

FilooFiloo.menuPage = SC.Page.design(
{
  mainView: SC.View.design(SC.Border,
  {
    classNames: ['main-view menu-view'],
    layout: { centerX: 0, centerY: 0, width: 300, height: FilooFiloo.MenuPage.gridHeight(5) },
    borderStyle: SC.BORDER_GRAY,
    childViews:
    [
      SC.ButtonView.design(
      {
	layout: FilooFiloo.MenuPage.cellLayout(0),
	title: 'Solo game',
	target: 'FilooFiloo.menuController',
	action: 'singleGame'
      }),
      SC.ButtonView.design(
      {
	layout: FilooFiloo.MenuPage.cellLayout(1),
	title: 'Internet game',
	target: 'FilooFiloo.menuController',
	action: 'versusGame'

      }),
      SC.ButtonView.design(
      {
	layout: FilooFiloo.MenuPage.cellLayout(2),
	title: 'High scores',
	target: 'FilooFiloo.menuController',
	action: 'highScores'
      }),
      SC.ButtonView.design(
      {
	layout: FilooFiloo.MenuPage.cellLayout(3),
	title: 'Rules',
	target: 'FilooFiloo.menuController',
	action: 'rules'
      }),
      SC.ButtonView.design(
      {
	layout: FilooFiloo.MenuPage.cellLayout(4),

	title: 'Credits',
	target: 'FilooFiloo.menuController',
	action: 'credits'
      })
    ]
  })
});

