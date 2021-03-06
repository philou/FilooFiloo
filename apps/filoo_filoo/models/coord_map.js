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
// FilooFiloo.CoordMap
// ==========================================================================

/** @class
  Helper class for a map from a coord to some value.
*/
FilooFiloo.CoordMap = SC.Object.extend(
/** @scope FilooFiloo.CoordMap.prototype */ {

    /**
      Number of items in the map.
    */
    count: 0,

    /**
      Gets the value stored at (x,y), or null if absent.
    */
    getAt: function(x,y) {
        var value = this.values_()[this.key_(x,y)];
        if (!value) {
            return null;
        }
	return value.value;
    },

    /**
      Stores value at (x,y).
    */
    put: function(x, y, value) {
        if (value) {
            if (!this.values_()[this.key_(x,y)]) {
                this.count++;
            }
	    this.values_()[this.key_(x,y)] = {x: x, y:y, value: value};
        }
        else {
            this.remove(x,y);
        }
    },

    /**
      Calls doSomething(x,y,value) for each element in this.
    */
    each: function(doSomething) {
        for (var key in this.values_()) {
            var value = this.values_()[key];
            doSomething(value.x, value.y, value.value);
        }
    },

    /**
      Removes the entry for (x,y).
    */
    remove: function(x,y) {
        if (this.getAt(x,y)) {
            this.count--;
        }
        delete(this.values_()[this.key_(x,y)]);
    },

    /**
      Removes all the items contained in anotherCoordMap.
    */
    removeEach: function(another) {
        FilooFiloo.assert(another);

        var that = this;
        another.each(function(x,y) { that.remove(x,y); });
    },

    /**
      Tests equality.
    */
    equals: function(other) {
        if (other.get('count') !== this.get('count')) {
            return false;
        }
        var result = true;
        this.each(function(x,y,value) {
            result &= (value === other.getAt(x, y));
        });
        return result;
    },

    /**
     * Extracts the sub coord map that contains (x,y) and the surrounding coords with the same color.
     */
    pieceContaining: function(x,y) {
        return this.collectPieceContaining_(x,y,FilooFiloo.CoordMap.create());
    },

    neighbors_: function(x,y) {
      return [{x:x-1,y:y},{x:x+1,y:y},{x:x,y:y-1},{x:x,y:y+1}];
    },

    collectPieceContaining_: function(x, y, result) {
      FilooFiloo.assert(result);
      var that = this;

      if (!result.getAt(x,y)) {
        var value = this.getAt(x,y);
        if (value) {
          result.put(x,y, value);

	  this.neighbors_(x,y).forEach(function (coord) {
	    that.collectPieceIfValue_(value, coord.x, coord.y, result);
	  });
	}
      }
      return result;
    },
    collectPieceIfValue_: function(value, x, y, result) {
        if (value === this.getAt(x,y)) {
          this.collectPieceContaining_(x, y, result);
        }
        return result;
    },

    values_: function() {
        if(!this.values) {
            this.values = {};
        }
        return this.values;
    },

    key_: function(x, y) {
	return x+";"+y;
    },

  surroundingPiece: function(value) {
    var result = FilooFiloo.CoordMap.create();
    var that = this;
    this.each(function(x,y) {
      that.neighbors_(x,y).forEach(function(coord) {
	if (!that.getAt(coord.x, coord.y)) {
	  result.put(coord.x, coord.y, value);
	}
      });
    });
    return result;
  }

});
