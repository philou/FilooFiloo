// Copyright (c) 2008-2010  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.

// You should have received a copy of the MIT License along with this
// program.  If not, see <http://www.opensource.org/licenses/mit-license.php>


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

