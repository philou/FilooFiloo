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

// This page describes the main user interface for your application.
FilooFiloo.mainPage = SC.Page.design(
{
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: SC.MainPane.design(
  {
    childViews: 'headerView modesTabView footerView'.w(),

    headerView: SC.ToolbarView.design(
    {
      layout: { top: 0, left: 0, right: 0, height: 36 },
      anchorLocation: SC.ANCHOR_TOP,
      childViews:
      [
	SC.LabelView.design(
	{
	  classNames: ['filoo-filoo-title'],
	  value: "Philou's Filoo-Filoo",
	  layout: { centerY: 0, left: 12, height: 24 },
	  fontWeight: SC.BOLD_WEIGHT
	}),
	SC.TextFieldView.design(
	{
	  hint: "login here",
	  layout: { centerY: 0, right: 12, height: 24, width: 200 },
	  valueBinding: 'FilooFiloo.loginController.name'
	})
      ]
    }),

    modesTabView: SC.ContainerView.design(
    {
      layout: { left:0, right:0, top:36, bottom:36 },
      nowShowingBinding: 'FilooFiloo.menuController.nowShowing'
    }),
    footerView: SC.ToolbarView.design(
    {
      layout: { bottom: 0, left: 0, right: 0, height: 36 },
      anchorLocation: SC.ANCHOR_BOTTOM,
      childViews:
      [
        SC.ButtonView.design(
	{
	  layout: { centerY: 0, height: 24, left: 12, width: 200 },
	  title: "Back to menu",
	  target: "FilooFiloo.menuController",
	  action: "backToMenu"
	}),
	SC.LabelView.design(
	{
	  value: "Philippe Bourgau 2008-2010",
	  textAlign: SC.ALIGN_RIGHT,
	  layout: { centerY: 0, height: 24, right: 12, width: 200 }
	})
    ]
    })
  }),
  loginPane: SC.SheetPane.create(
  {
    layout: { width: 400, height: 200, centerX: 0 },
    contentView: SC.View.extend(
    {
      layout: { top: 0, left: 0, bottom: 0, right: 0 },
      childViews:
      [
	SC.LabelView.extend(
	{
	  layout: { height: 36, top: 10, left: 10, right: 10 },
	  textAlign: SC.ALIGN_CENTER,
	  valueBinding: 'FilooFiloo.loginController.loginTitle'
	}),
	SC.LabelView.extend(
	{
	  layout: { height: 50, top: 50, left: 10, right: 10 },
	  textAlign: SC.ALIGN_CENTER,
	  valueBinding: 'FilooFiloo.loginController.loginCaption'
	}),
	SC.TextFieldView.extend(
	{
	  layout: { centerX: 0, height: 24, bottom: 50, width: 200 },
	  hint: "login here",
	  valueBinding: 'FilooFiloo.loginController.name',
	  isVisibleBinding: 'FilooFiloo.loginController.loginTextRequired'
	}),
	SC.ButtonView.extend(
	{
	  layout: { centerX: 0, height: 24, bottom: 10, width: 100 },
	  textAlign: SC.ALIGN_CENTER,
	  title: "OK",
	  action: 'closeLoginPane',
	  target: 'FilooFiloo.loginController'
	})
      ]
    })
  })
});

