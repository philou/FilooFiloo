// ==========================================================================
// Project:   FilooFiloo - mainPage
// Copyright: ©2008-2010 Philippe Bourgau, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>
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
    return this.scoreRows(index,index);
  },
  scoreRows: function(startIndex, endIndex) {
    return {
      width: this.SCORE_ROW_WIDTH,
      centerX: 0,
      height: this.SCORE_ROW_HEIGHT*(endIndex+1-startIndex) + endIndex-startIndex,
      top: this.scoreRowTop(startIndex)
    };
  }
};
