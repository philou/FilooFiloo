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

/*globals FilooFiloo */

/** @class
  (Document your Model here)
*/
FilooFiloo.Random = {

  randomInteger: function(max) {
    return Math.floor(Math.random() * max) % max;
  },

  nextFreeIndex: function(array, start) {
    var len = array.length;
    var result = start;
    while(result < len && array[result]) {
      result++;
    }
    return result;
  },

  nthFreeIndex: function(array, n) {
    var len = array.length;
    var result = 0;
    for(var i = 0; i <= n; i++) {
      result = this.nextFreeIndex(array, result);
      if (i!=n) {
	result++;
      }
    }
    if (len <= result) {
      return -1;
    }
    return result;
  },

  randomUniqueIntegers: function(requested, max) {
    var integersArray = [];
    var i = 0;

    for(i = 0; i < max; i++) {
      integersArray[i] = NO;
    }
    for(i = 0; i < requested; i++) {
      var random = this.randomInteger(max-i);
      integersArray[this.nthFreeIndex(integersArray, random)] = YES;
    }

    var result = [];
    for(i = 0; i < max; i++) {
      if(integersArray[i])
	result.push(i);
    }
    return result;
  }
};
