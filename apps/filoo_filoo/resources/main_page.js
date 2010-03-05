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
  })

});

/*

<% content_for('body') do %>

<div id="header">
  <h1 id="title">Philou's Filoo-Filoo</h1>
  <div id="login">
    <%= text_field_view :login_text, :hint => 'login here', :bind => {:value => 'FilooFiloo.loginController.name' } %>
  </div>
</div>

<div id="content">
  <%= tab_view :modes_tabs,
               :lazy_tabs => true,
               :segments => [[:single, "1 player"],
                             [:versus, "2 players"],
                             [:high_scores, "High scores"],
                             [:rules, "Rules"],
                             [:credits, "Credits"]],
               :now_showing => :single, :bind => { :now_showing => 'FilooFiloo.versusController.currentMode' } %>
</div>
<% end %>

<% view :login_pane, :class => 'dialog', :pane => :dialog, :width => 300, :bind => {:visible => 'FilooFiloo.loginController.loginPaneVisible' } do %>
  <h1><%= label_view :bind => { :value => 'FilooFiloo.loginController.loginTitle' } %></h1>

  <p><%= label_view :bind => { :value => 'FilooFiloo.loginController.loginCaption' } %></p>
  <%= text_field_view :required_login_text, :hint => 'login here', :bind => {:value => 'FilooFiloo.loginController.name', :visible => 'FilooFiloo.loginController.loginTextRequired' } %>
  <%= button_view :title => 'Ok', :default => true, :action => 'FilooFiloo.loginController.closeLoginPane' %>
<% end %>

*/

