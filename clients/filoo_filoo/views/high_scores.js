// Copyright (c) 2008-2009  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.

// You should have received a copy of the MIT License along with this
// program.  If not, see <http://www.opensource.org/licenses/mit-license.php>


// ==========================================================================
// FilooFiloo.HighScoresView
// ==========================================================================

require('core');

/** @class

  (Document Your View Here)

  @extends SC.View
  @author AuthorName
  @version 0.1
*/
FilooFiloo.HighScoresView = SC.View.extend( function() {
    /** @scope FilooFiloo.HighScoresView.prototype */
    var headerRow = '<tr><th>Rank</th><th>Player</th><th>Score</th></tr>';

    return {
        content: null,
        emptyElement: '<table>' + headerRow + '</table>',

        render: function() {
            var content = this.get('content');
            var html = [];
            var i = 0;
            var highScore = null;

            html.push(headerRow);
            for(i = 0; i < content.length; i++) {
                highScore = content[i];

                html.push('<tr><td>');
                html.push((i+1).toString());
                html.push('</td><td>');
                html.push(highScore.get('playerName'));
                html.push('</td><td>');
                html.push((highScore.get('score') || 0).toString());
                html.push('</td></tr>');
            }

            this.set('innerHTML', html.join(''));
        }.observes('content')
    };
}()) ;
