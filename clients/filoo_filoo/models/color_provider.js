// ==========================================================================
// FilooFiloo.ColorProvider
// ==========================================================================

require('core');

/** @class

  Random color generator

  @extends SC.Record
  @author Philou
  @version 0.1
*/
FilooFiloo.ColorProvider = SC.Record.extend(
/** @scope FilooFiloo.ColorProvider.prototype */ {

    /**
      Private function returning a random color.
    */
    randomColor_: function() {
	var colors = FilooFiloo.Game.Colors;
	var rand = Math.random();
	var index = Math.round(rand * colors.length) % colors.length;

	return colors[index];
    },	

    /**
      Color for the first filoo of a piece.
    */
    popFirstColor: function() {
	return this.randomColor_();
    },
    /**
      Color for the second filoo of a piece.
    */
    popSecondColor: function() {
	return this.randomColor_();
    }

}) ;
