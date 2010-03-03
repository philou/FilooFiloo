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
// FilooFiloo.ColorProvider
// ==========================================================================

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
