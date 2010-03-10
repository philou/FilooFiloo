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

FilooFiloo.singlePageInternals = {

  newScoreBoardRow: function(title, index, boardFieldBinding)
  {
    return SC.View.design(
    {
      layout: FilooFiloo.Layout.scoreRow(index),
      childViews:
      [
	SC.LabelView.design(
	{
	  layout: { left: 0, width: FilooFiloo.Layout.SCORE_ROW_WIDTH / 2 - 1 },
	  value: title
	}),
	SC.LabelView.design(
	{
	  layout: { right: 0, width: FilooFiloo.Layout.SCORE_ROW_WIDTH / 2 -1 },
	  value: '0',
	  valueBinding: 'FilooFiloo.singleController.board.'+boardFieldBinding
	})
      ]
    });
  }
};

FilooFiloo.singlePage = SC.Page.design(
{
  mainView: SC.View.design(
  {
    classNames: ['main-view'],
    layout: FilooFiloo.Layout.MAIN_VIEW,
    childViews:
    [
      SC.ButtonView.design(
      {
	layout: FilooFiloo.Layout.scoreRow(0),
	titleBinding: 'FilooFiloo.singleController.startStopLabel',
	target: 'FilooFiloo.singleController',
	action: 'startStop'
      }),
      SC.View.design(
      {
	classNames: ['scores'],
	layout: FilooFiloo.Layout.scoreRows(1,3),
	childViews:
	[
	  FilooFiloo.singlePageInternals.newScoreBoardRow('Filoos', 0, 'disappearedPieces'),
	  FilooFiloo.singlePageInternals.newScoreBoardRow('Score', 1, 'score'),
	  FilooFiloo.singlePageInternals.newScoreBoardRow('Level', 2, 'level')
	]
      }),
      FilooFiloo.BoardView.design(
      {
	layout: { left: 1, right: 1, top: FilooFiloo.Layout.scoreRowTop(4), height: 380 },
	contentBinding: 'FilooFiloo.singleController.board'
      })
    ]
  })
});

