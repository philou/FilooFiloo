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

sc_require('views/layout');

FilooFiloo.versusPage = SC.Page.design(
{
  mainView: SC.View.design(
  {
    classNames: ['main-view'],
    layout: { centerX: 0, centerY: 0, width: 658, height: 399 },
    childViews: 'playerView opponentView'.w(),

    playerView: FilooFiloo.Layout.detailedBoardView('FilooFiloo.versusController.board', { left: 0, centerY: 0 }),

    opponentView: SC.View.design(SC.Border,
    {
      layout: { right: 0, centerY: 0, width: 321, height: 395 },
      borderStyle: SC.BORDER_GRAY,
      childViews: 'nameView boardView'.w(),

      nameView: SC.LabelView.design(
      {
	layout: { right: 12, centerY: 0, width: 100, height: 24 },
	textAlign: SC.ALIGN_CENTER,
	fontWeight: SC.BOLD_WEIGHT,
	valueBinding: 'FilooFiloo.versusController.opponent.name'
      }),

      boardView: FilooFiloo.BoardView.design(
      {
	layout: { left: 12, centerY: 0, width: 185, height: 371 },
	contentBinding: 'FilooFiloo.versusController.opponentBoard'
      })
    })
  }),

  whatIsPlayerDoingPane: SC.SheetPane.create(
  {
    layout: { width: 400, height: 200, centerX: 0 },
    contentView: SC.View.extend(
    {
      layout: { top: 0, left: 0, bottom: 0, right: 0 },
      childViews:
      [
	SC.LabelView.extend(
	{
	  layout: { left: 12, right: 12, centerY: 0, height: 24 },
	  textAlign: SC.ALIGN_CENTER,
	  fontWeight: SC.BOLD_WEIGHT,
	  valueBinding: 'FilooFiloo.versusController.whatIsPlayerDoing'
	}),
        SC.ButtonView.design(
	{
	  layout: { centerX: 0, width: 200, height: 24, bottom: 12 },
	  title: "Back to menu",
	  target: "FilooFiloo.menuController",
	  action: "backToMenu"
	})
      ]
    })
  })
});

