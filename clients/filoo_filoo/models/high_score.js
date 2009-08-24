// ==========================================================================
// FilooFiloo.HighScore
// ==========================================================================

require('core');

/** @class

  (Document your class here)

  @extends SC.Record
  @author AuthorName
  @version 0.1
*/
FilooFiloo.HighScore = SC.Record.extend(
/** @scope FilooFiloo.HighScore.prototype */ {

    dataSource: FilooFiloo.server,
    resourceURL: 'high_scores',

    properties: ['playerName', 'score'],
    primaryKey: 'guid',

    ranking: function() {
        return -this.get('score');
    }.property('score')

}) ;
