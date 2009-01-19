// ==========================================================================
// PuyoPuyo.HighScoresView
// ==========================================================================

require('core');

/** @class

  (Document Your View Here)

  @extends SC.View
  @author AuthorName
  @version 0.1
*/
PuyoPuyo.HighScoresView = SC.View.extend( function() {
    /** @scope PuyoPuyo.HighScoresView.prototype */ 
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
                html.push(highScore.get('score').toString());
                html.push('</td></tr>');
            }
        
            this.set('innerHTML', html.join(''));
        }.observes('content')
    };
}()) ;
