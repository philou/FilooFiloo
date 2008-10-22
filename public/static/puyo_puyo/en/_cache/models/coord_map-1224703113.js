/* Start ----------------------------------------------------- models/coord_map.js*/

// ==========================================================================
// PuyoPuyo.CoordMap
// ==========================================================================

require('core');

/** @class

  Helper class for a map from a coord to some value.

  @extends SC.Record
  @author Philou
  @version 0.1
*/
PuyoPuyo.CoordMap = SC.Object.extend(
/** @scope PuyoPuyo.CoordMap.prototype */ {

    /**
      Number of items in the map.
    */
    count: 0,

    /**
      Gets the value stored at (x,y), or null if absent.
    */
    getAt: function(x,y) {
	return this[this.key_(x,y)] || null;
    },

    /**
      Stores value at (x,y).
    */
    put: function(x, y, value) {
	this[this.key_(x,y)] = value;
    },

    key_: function(x, y) {
	return x+";"+y;
    }

}) ;


/* End ------------------------------------------------------- models/coord_map.js*/

