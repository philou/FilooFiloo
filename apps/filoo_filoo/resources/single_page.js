// ==========================================================================
// Project:   FilooFiloo - rules page
// Copyright: ©2008-2010 Philippe Bourgau, Inc.
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

  newScoreBoardRow: function(title, index)
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
	  value: '0'
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
	title: 'Start / Stop'
      }),
      SC.View.design(
      {
	classNames: ['scores'],
	childViews:
	[
	  FilooFiloo.singlePageInternals.newScoreBoardRow('Filoos', 1),
	  FilooFiloo.singlePageInternals.newScoreBoardRow('Score', 2),
	  FilooFiloo.singlePageInternals.newScoreBoardRow('Level', 3)
	]
      }),
      FilooFiloo.BoardView.design(
      {
	layout: { left: 1, right: 1, top: FilooFiloo.Layout.scoreRowTop(4), height: 380 }
      })
    ]
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