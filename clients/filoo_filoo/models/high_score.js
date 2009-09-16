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
