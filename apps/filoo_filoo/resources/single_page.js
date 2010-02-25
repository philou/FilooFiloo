// ==========================================================================
// Project:   FilooFiloo - rules page
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

FilooFiloo.singlePageInternals = {

  newScoreBoardRow: function(title, top)
  {
    return SC.View.design(
    {
      layout: { left: 1, right: 1, top: top, height: 24 },
      childViews:
      [
	SC.LabelView.design(
	{
	  layout: { left: 0, width: 149 },
	  value: title
	}),
	SC.LabelView.design(
	{
	  layout: { right: 0, width: 149 },
	  value: '0'
	})
	]
      });
    }
};

FilooFiloo.singlePage = SC.Page.design(
{
  mainView: SC.ScrollView.design(
  {
    layout: { top: 20, bottom: 0, centerX: 0, width: 300 },
    contentView: SC.View.design(
    {
      childViews:
      [
	SC.ButtonView.design(
	{
	  layout: { left: 1, right: 1, top: 1, height: 24 },
	  title: 'Start / Stop'
	}),
	FilooFiloo.singlePageInternals.newScoreBoardRow('Filoos', 26),
	FilooFiloo.singlePageInternals.newScoreBoardRow('Score', 51),
	FilooFiloo.singlePageInternals.newScoreBoardRow('Level', 76),
	FilooFiloo.BoardView.design(
	{
	  layout: { left: 1, right: 1, top: 101, height: 200 }
	})
      ]
    })
  })
});

/*<% view :single_tab do %>

<div class="single">
  <%= button_view :startStop, :action => 'FilooFiloo.singleController.startStop', :default => true, :title => 'Start & stop', :bind => {:title => 'FilooFiloo.singleController.startStopLabel' } %>
  <table class="scores">
    <tr>
      <td>Filoos</td><td><%= label_view :disappeared_pieces, :value => "0", :bind => {:value => 'FilooFiloo.singleController.board.disappearedPieces' } %></td>
    </tr>
    <tr>
      <td>Score</td><td><%= label_view :score, :value => "0", :bind => {:value => 'FilooFiloo.singleController.board.score' } %></td>
    </tr>
    <tr>
      <td>Level</td><td><%= label_view :level, :value => "0", :bind => {:value => 'FilooFiloo.singleController.board.level' } %></td>
    </tr>
  </table>
  <%= view :singleBoardView, :tag => :table, :class => 'board', :view => 'FilooFiloo.BoardView',
      :bind => { :board => 'FilooFiloo.singleController.board' } %>
</div>
<% end %>
*/