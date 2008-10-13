/* Start ----------------------------------------------------- models/color_provider.js*/

// ==========================================================================
// PuyoPuyo.ColorProvider
// ==========================================================================

require('core');

/** @class

  Random color generator

  @extends SC.Record
  @author Philou
  @version 0.1
*/
PuyoPuyo.ColorProvider = SC.Record.extend(
/** @scope PuyoPuyo.ColorProvider.prototype */ {

    /**
      Private function returning a random color.
    */
    randomColor_: function() {
	var colors = App.Game.Colors;
	var rand = Math.random();
	var index = Math.round(rand * colors.length) % colors.length;

	return colors[index];
    },	

    /**
      Color for the first puyo of a piece.
    */
    popFirstColor: function() {
	return this.randomColor();
    },
    /**
      Color for the second puyo of a piece.
    */
    popSecondColor: function() {
	return this.randomColor();
    }

}) ;


/* End ------------------------------------------------------- models/color_provider.js*/

