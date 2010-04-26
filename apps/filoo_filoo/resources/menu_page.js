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

FilooFiloo.menuPage = SC.Page.design(
{
  mainView: SC.View.design(
  {
    classNames: ['main-view'],
    layout: FilooFiloo.Layout.MAIN_VIEW,
    childViews:
    [
      SC.ButtonView.design(
      {
	layout: { top: 12, height: 36, left: 12, right: 12 },
	title: 'Solo game',
	target: 'FilooFiloo.menuController',
	action: 'singleGame'
      }),
      SC.ButtonView.design(
      {
	layout: { top: 60, height: 36, left: 12, right: 12 },
	title: 'Internet game',
	target: 'FilooFiloo.menuController',
	action: 'versusGame'

      }),
      SC.ButtonView.design(
      {
	layout: { top: 108, height: 36, left: 12, right: 12 },
	title: 'High scores',
	target: 'FilooFiloo.menuController',
	action: 'highScores'
      }),
      SC.ButtonView.design(
      {
	layout: { top: 156, height: 36, left: 12, right: 12 },
	title: 'Rules',
	target: 'FilooFiloo.menuController',
	action: 'rules'
      }),
      SC.ButtonView.design(
      {
	layout: { top: 204, height: 36, left: 12, right: 12 },
	title: 'Credits',
	target: 'FilooFiloo.menuController',
	action: 'credits'
      })
    ]
  })
});

