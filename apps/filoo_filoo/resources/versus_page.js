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


FilooFiloo.versusPage = SC.Page.design(
{
  mainView: SC.View.design(
  {
    classNames: ['main-view'],
    layout: { top: 20, bottom: 0, centerX: 0, width: 600 },
    childViews:
    [
      SC.View.design(
      {
	layout: { top: 0, bottom: 0, left: 0, width: 300 },
	childViews:
	[
	  SC.LabelView.design(
	  {
	    layout: FilooFiloo.Layout.scoreRow(0),
	    value: 'You'
	  }),
	  SC.LabelView.design(
	  {
	    layout: FilooFiloo.Layout.scoreRow(1),
	    valueBinding: 'FilooFiloo.versusController.whatIsPlayerDoing'
	  }),
	  FilooFiloo.BoardView.design(
	  {
	    layout: { left: 1, right: 1, top: FilooFiloo.Layout.scoreRowTop(2), height: 380 },
	    contentBinding: 'FilooFiloo.versusController.board'
	  })
	]
      }),
      SC.View.design(
      {
	layout: { top: 0, bottom: 0, right: 0, width: 300 },
	childViews:
	[
	  SC.LabelView.design(
	  {
	    layout: FilooFiloo.Layout.scoreRow(0),
	    value: 'Opponent'
	  }),
	  SC.LabelView.design(
	  {
	    layout: FilooFiloo.Layout.scoreRow(1),
	    valueBinding: 'FilooFiloo.versusController.whatIsOpponentDoing'
	  }),
	  FilooFiloo.BoardView.design(
	  {
	    layout: { left: 1, right: 1, top: FilooFiloo.Layout.scoreRowTop(2), height: 380 },
	    contentBinding: 'FilooFiloo.versusController.opponentBoard'
	  })
	]
      })

    ]
  })
});

