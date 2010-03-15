// ==========================================================================
// Project:   FilooFiloo.MainDataSource
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals FilooFiloo */

sc_require('models/high_score');

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

  retrieveRecord: function(store, storeKey) {

    // TODO: Add handlers to retrieve an individual record's contents
    // call store.dataSourceDidComplete(storeKey) when done.

    return NO ; // return YES if you handled the storeKey
  },

  createRecord: function(store, storeKey) {

    if(SC.kindOf(store.recordTypeFor(storeKey), FilooFiloo.HighScore)) {
      SC.Request.postUrl('/high_scores').json()
	.notify(this, 'didCreateHighScore', store, storeKey)
	.send(store.readDataHash(storeKey));
      return YES;
    }

    return NO;
  },

  didCreateHighScore: function(response, store, storeKey) {
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

    // TODO: Add handlers to submit modified record to the data source
    // call store.dataSourceDidComplete(storeKey) when done.

    return NO ; // return YES if you handled the storeKey
  },

  destroyRecord: function(store, storeKey) {

    // TODO: Add handlers to destroy records on the data source.
    // call store.dataSourceDidDestroy(storeKey) when done

    return NO ; // return YES if you handled the storeKey
  }

}) ;
