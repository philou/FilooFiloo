// ==========================================================================
// Project:   FilooFiloo - mainPage
// Copyright: ©2008-2010 Philippe Bourgau, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.
//
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.
//
// You should have received a copy of the MIT License along with this
// program. If not, see <http://www.opensource.org/licenses/mit-license.php>
//
// ==========================================================================
/*globals FilooFiloo */

/** @class

  Constants for layout.

*/
FilooFiloo.Layout = {

  MAIN_VIEW: { top: 20, bottom: 0, centerX: 0, width: 300 },
  SCORE_ROW_HEIGHT: 24,
  SCORE_ROW_WIDTH: 200,
  scoreRowTop: function(index) {
    return index*(this.SCORE_ROW_HEIGHT+1)+1;
  },
  scoreRow: function(index) {
    return {
      width: this.SCORE_ROW_WIDTH,
      centerX: 0,
      height: this.SCORE_ROW_HEIGHT,
      top: this.scoreRowTop(index)
    };
  }
};
