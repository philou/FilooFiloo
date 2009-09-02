// ==========================================================================
// FilooFiloo.Player
// ==========================================================================

require('core');

/** @class

  (Document your class here)

  @extends SC.Record
  @author AuthorName
  @version 0.1
*/
FilooFiloo.Player = SC.Record.extend(
/** @scope FilooFiloo.Player.prototype */ {

  dataSource: FilooFiloo.server,
  resourceURL: 'players',
  type: 'Player', // I added this for the refresh function to know the type of the incoming json record

  properties: ['name', 'opponentName'],
  primaryKey: 'guid'
}) ;
