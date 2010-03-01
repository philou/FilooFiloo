// ==========================================================================
// Project:   FilooFiloo - rules page
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

FilooFiloo.rulesPage = SC.Page.design({

  mainView: SC.LabelView.design(
  {
    layout: FilooFiloo.Layout.MAIN_VIEW,
    classNames: ['main-view', 'information'],
    escapeHTML: NO,
    value: "<h2>Summary</h2><p>This point of this game is to make disappear the falling filoos buy grouping them by four or more of the same color.</p><p>The gameplay is tetris like, only the currend falling filoos can be controlled.</p><p>Two filoos are in the same group if they have the same color, and if they are in adjacent cells, diagonals do not work. This relation is transitive.</p><p>Unlike tetris, pieces always fall to the bottom, that means no 'hole' can appear in the stack of filoos. Particularly, when blocked, the current falling filoos can split in two.</p><p>It is possible to earn extra point by chaining disappearances: when a group disappears, the filoos on top of it fall down, what might cause new groups to be formed and to disapear aswell, and so on.</p><h2>Keys</h2><table><tr><td>up</td><td>rotate counter clockwise</td></tr><tr><td>down</td><td>rotate clockwise</td></tr><tr><td>right</td><td>move to the right</td></tr><tr><td>left</td><td>move the the left</td></tr><tr><td>space</td><td>drops to the bottom</td></tr></table>"
  })
});

