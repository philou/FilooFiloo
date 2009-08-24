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
