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

FilooFiloo.highScoresPage = SC.Page.design(
{
  mainView: SC.View.design(
  {
    classNames: ['main-view'],
    layout: FilooFiloo.Layout.MAIN_VIEW,
    childViews:
    [

      SC.LabelView.design(
      {
	layout: { top: 0, height: 24, left: 0, right: 0 },
	textAlign: SC.ALIGN_CENTER,
	fontWeight: SC.BOLD_WEIGHT,
	value: "Hall of fame"
      }),

      SC.ScrollView.design(
      {
	hasHorizontalScroller: NO,
	layout: { top: 48, bottom: 0, left: 12, right: 12 },
	contentView: SC.ListView.design(
	{
	  contentBinding: 'FilooFiloo.highScoresController.arrangedObjects',
	  selectionBinding: 'FilooFiloo.highScoresController.selection',
	  contentValueKey: 'summary'
	})
      })
    ]
  })
});

