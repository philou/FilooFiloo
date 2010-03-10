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
    childViews: 'headerView modesTabView'.w(),

    headerView: SC.ToolbarView.design(
    {
      layout: { top: 0, left: 0, right: 0, height: 36 },
      anchorLocation: SC.ANCHOR_TOP,
      childViews:
      [
	SC.LabelView.design(
	{
	  tagName: 'h1',
	  value: "Philou's Filoo-Filoo",
	  layout: { top: 0, left: 0, height: 36 }
	}),
	SC.TextFieldView.design(
	{
	  hint: "login here",
	  layout: { bottom: 0, right: 0, height: 24, width: 200 },
	  valueBinding: 'FilooFiloo.loginController.name'
	})
      ]
    }),

    modesTabView: SC.TabView.design(
    {
      nowShowing: "FilooFiloo.rulesPage.mainView", // ça n'a pas l'air d'être ça.
      items: [
	{ title: "Single player", value: "FilooFiloo.singlePage.mainView" },
	{ title: "Rules", value: "FilooFiloo.rulesPage.mainView" },
	{ title: "Credits", value: "FilooFiloo.creditsPage.mainView" }
      ],

      itemTitleKey: 'title',
      itemValueKey: 'value',

      layout: { left:12, right:12, top:48, bottom:12 },

      userDefaultKey: "mainPane"
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
	  layout: { centerX: 0, height: 36, top: 0, left: 10, right: 10 },
	  valueBinding: 'FilooFiloo.loginController.loginTitle'
	}),
	SC.LabelView.extend(
	{
	  layout: { centerX: 0, height: 24, top: 36, left: 10, right: 10 },
	  valueBinding: 'FilooFiloo.loginController.loginCaption'
	}),
	SC.TextFieldView.extend(
	{
	  layout: { centerX: 0, height: 24, top: 60, left: 10, right: 10 },
	  hint: "login here",
	  valueBinding: 'FilooFiloo.loginController.name',
	  isVisibleBinding: 'FilooFiloo.loginController.loginTextRequired'
	}),
	SC.ButtonView.extend(
	{
	  layout: { centerX: 0, height: 24, top: 84, left: 10, right: 10 },
	  title: "OK",
	  action: 'closeLoginPane',
	  target: 'FilooFiloo.loginController'
	})
      ]
    })
  })
});

