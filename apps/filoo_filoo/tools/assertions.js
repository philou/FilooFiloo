// Copyright (c) 2008-2010  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.

// You should have received a copy of the MIT License along with this
// program.  If not, see <http://www.opensource.org/licenses/mit-license.php>


// ==========================================================================
// FilooFiloo.Assertions
// ==========================================================================

/**

  Static assertion utilities

  @author Philou
  @version 0.1
*/

/**
  Classic assert.
*/
FilooFiloo.assert = function(condition, message) {
    message = message || "Assertion failed.";
    if (!condition) {
	throw message;
    }
};
