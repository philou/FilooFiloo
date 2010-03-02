// Copyright (c) 2008-2009  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.

// You should have received a copy of the MIT License along with this
// program.  If not, see <http://www.opensource.org/licenses/mit-license.php>


// dangerous : TODO refactor everywhere it is used.
var idem = "no change";

FilooFiloo.TestsHelpers = {

    /**
      Asserts the actual values against the values passed in a string rows list.
    */
    assertStringRows: function(fixture, stringRows, nRows, nCols, actualValues, message) {
	equals(nRows, stringRows.length, message + ", row count is different");

	for(var r = 0; r < nRows; ++r) {
	    equals(nCols, stringRows[r].length, message + ", col count is different at row "+r);

	    for(var c = 0; c < nCols; ++c) {
		equals(FilooFiloo.Game.initialToState[stringRows[r][c]],
				        actualValues(c, r),
				        message + " at (col="+c+", row="+r+')');
	    }
	}
    },

    /**
      Initializes a coord map with a string rows list.
    */
    newCoordMap: function(stringRows) {
	var result = FilooFiloo.CoordMap.create();

	for(var r = 0; r < stringRows.length; ++r) {
	    for(var c = 0; c < stringRows[r].length; ++c) {
		result.put(c, r, FilooFiloo.Game.initialToState[stringRows[r][c]]);
	    }
	}

	return result;
    },

    /**
      Transposes a list of cells representing a matrix with n rows of size nCols, into nCols lists of n elements representing the columns.
    */
    transpose: function(fixture, cellsList, nCols) {
        var result = [];
        for(var i = 0; i < nCols; ++i) {
            result[i] = [];
        }
	equals(0, cellsList.length % nCols);
	for(var i = 0; i < cellsList.length; ++i) {
	    if (cellsList[i] === idem) {
		result[i % nCols] = idem;
	    }
	    else {
		result[i % nCols].push(cellsList[i]);
	    }
	}
        return result;
    },

    /**
      Performs the given action n times.
    */
    times: function(n, action) {
        for(var i = 0; i < n; ++i) {
            action();
        }
    }
};
