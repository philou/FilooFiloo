// ==========================================================================
// PuyoPuyo.Assertions
// ==========================================================================

/**

  Static assertion utilities

  @author Philou
  @version 0.1
*/

/**
  Classic assert.
*/
PuyoPuyo.assert = function(condition, message) {
    message = message || "Assertion failed.";
    if (!condition) {
	throw message;
    }
};
