// ==========================================================================
// Project:   FilooFiloo - mainPage
// Copyright: ©2008-2009 Philippe Bourgau, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.
//
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.
//
// You should have received a copy of the MIT License along with this
// program. If not, see <http://www.opensource.org/licenses/mit-license.php>
//
// ==========================================================================
/*globals FilooFiloo */

// This page describes the main user interface for your application.
FilooFiloo.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'tabView'.w(),

    tabView: SC.TabView.design({

      value: "Rules",
      items: [
	{ title: "Rules", value: "FilooFiloo.rulesPage.mainView" },
	{ title: "Credits", value: "FilooFiloo.creditsPage.mainView" }
      ],

      itemTitleKey: 'title',
      itemValueKey: 'value',

      layout: { left:12, right:12, top:12, bottom:12 },

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