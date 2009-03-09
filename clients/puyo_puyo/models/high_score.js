// ==========================================================================
// PuyoPuyo.HighScore
// ==========================================================================

require('core');

/** @class

  (Document your class here)

  @extends SC.Record
  @author AuthorName
  @version 0.1
*/
PuyoPuyo.HighScore = SC.Record.extend(
/** @scope PuyoPuyo.HighScore.prototype */ {

    dataSource: PuyoPuyo.server,
    resourceURL: 'high_scores',

    properties: ['playerName', 'score'],
    primaryKey: 'guid',

    ranking: function() {
        return -this.get('score');
    }.property('score')

}) ;
