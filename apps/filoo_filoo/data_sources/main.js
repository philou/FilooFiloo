// Copyright (c) 2008-2010  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// program.  If not, see <http://www.gnu.org/licenses/>

// ==========================================================================
// FilooFiloo.MainDataSource
// ==========================================================================

sc_require('models/high_score');
sc_require('models/player');

FilooFiloo.HIGH_SCORES_QUERY = SC.Query.local(FilooFiloo.HighScore, { orderBy: 'score' });

/** @class

  (Document Your Data Source Here)

  @extends SC.DataSource
*/
FilooFiloo.MainDataSource = SC.DataSource.extend(
/** @scope FilooFiloo.MainDataSource.prototype */ {

  // ..........................................................
  // QUERY SUPPORT
  //

  fetch: function(store, query) {

    if (query === FilooFiloo.HIGH_SCORES_QUERY) {
      SC.Request.getUrl('/high_scores').json()
	.notify(this, 'didFetchHighScores', store, query)
	.send();
      return YES;
    }
    return NO;
  },

  didFetchHighScores: function(response, store, query) {
    if(SC.ok(response)) {
      store.loadRecords(FilooFiloo.HighScore, response.get('body').content);
      store.dataSourceDidFetchQuery(query);
    }
    else {
      store.dataSourceDidErrorQuery(query, response);
    }
  },

  // ..........................................................
  // RECORD SUPPORT
  //

  handlesRecordType: function(store, storeKey) {
    return SC.kindOf(store.recordTypeFor(storeKey), FilooFiloo.HighScore) ||
      SC.kindOf(store.recordTypeFor(storeKey), FilooFiloo.Player);
  },
  recordTypeUrl: function(store, storeKey) {
    if (SC.kindOf(store.recordTypeFor(storeKey), FilooFiloo.HighScore))
      return "/high_scores";
    if (SC.kindOf(store.recordTypeFor(storeKey), FilooFiloo.Player))
      return "/players";
    throw "unhandled record type.";
  },

  retrieveRecord: function(store, storeKey) {
    if (this.handlesRecordType(store, storeKey)) {

      var url = store.idFor(storeKey);
      SC.Request.getUrl(url).json()
	.notify(this, 'didRetrieveRecord', store, storeKey)
	.send();
      return YES;
    }
    return NO;
  },
  didRetrieveRecord: function(response, store, storeKey) {
    if (SC.ok(response)) {
      var dataHash = response.get('body').content;
      store.dataSourceDidComplete(storeKey, dataHash);
    }
    else {
      store.dataSourceDidError(storeKey, response);
    }
  },

  createRecord: function(store, storeKey) {
    if(this.handlesRecordType(store,storeKey)) {
      SC.Request.postUrl(this.recordTypeUrl(store, storeKey)).json()
	.notify(this, 'didCreateRecord', store, storeKey)
	.send(store.readDataHash(storeKey));
      return YES;
    }
    return NO;
  },

  didCreateRecord: function(response, store, storeKey) {
    if (SC.ok(response)) {
      // Adapted from parseUri 1.2.2
      // (c) Steven Levithan <stevenlevithan.com>
      // MIT License
      var parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
      var url = parser.exec(response.header('Location'))[8];
      store.dataSourceDidComplete(storeKey, null, url); // update url
    }
    else {
      store.dataSourceDidError(storeKey, response);
    }
  },

  updateRecord: function(store, storeKey) {
    if (this.handlesRecordType(store, storeKey)) {
      SC.Request.putUrl(store.idFor(storeKey)).json()
      .notify(this, this.didUpdateRecord, store, storeKey)
      .send(store.readDataHash(storeKey));

      return YES;
    }
    return NO ;
  },

  didUpdateRecord: function(response, store, storeKey) {
    if (SC.ok(response)) {
      var data = response.get('body');
      if (data) {
	data = data.content; // if hash is returned; use it.
      }
      store.dataSourceDidComplete(storeKey, data) ;
    }
    else {
      store.dataSourceDidError(storeKey);
    }
  },

  destroyRecord: function(store, storeKey) {

    // TODO: Add handlers to destroy records on the data source.
    // call store.dataSourceDidDestroy(storeKey) when done

    return NO ; // return YES if you handled the storeKey
  }

}) ;
