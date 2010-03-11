// Copyright (c) 2008-2010  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.

// You should have received a copy of the MIT License along with this
// program.  If not, see <http://www.opensource.org/licenses/mit-license.php>

sc_require('views/layout');

FilooFiloo.highScoresPage = SC.Page.design(
{
  mainView: SC.View.design(
  {
    classNames: ['main-view'],
    layout: FilooFiloo.Layout.MAIN_VIEW,
    childViews:
    [
      SC.ScrollView.design(
      {
	hasHorizontalScroller: NO,
	layout: { top: 10, bottom: 0, left: 0, right: 0 },
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

