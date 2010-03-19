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
    layout: FilooFiloo.Layout.MAIN_VIEW,
    childViews:
    [
      SC.LabelView.design(
      {
	layout: FilooFiloo.Layout.scoreRow(0),
	value: 'YOU'
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
  })
});

/*
<% view :versus_tab do %>

<div class="versus">
  <p><%= label_view :bind => { :value => 'FilooFiloo.versusController.whatIsPlayerDoing' } %></p>
  <div id="boards">
    <div id="yourArea">
      <%= view :yourBoardView, :tag => :table, :class => 'board', :view => 'FilooFiloo.BoardView',
        :bind => { :board => 'FilooFiloo.versusController.board' } %>
      <p>YOU</p>
    </div>
  </div>
</div>
<% end %>
*/


