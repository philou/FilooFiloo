// ==========================================================================
// Project:   FilooFiloo - credits page
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

FilooFiloo.creditsPage = SC.Page.design(
  {

  mainView: SC.LabelView.design({
    layout: FilooFiloo.Layout.MAIN_VIEW,
    classNames: ['main-view', 'information'],
    escapeHTML: NO,
    value: "<h2>Contributors</h2><p>This <a href=\"http://en.wikipedia.org/wiki/Puyo_Puyo_Tsu\">Puyo-Puyo</a> clone was done by Philippe Bourgau, 2008-2010.</p><h2>Licence</h2><p><a href=\"http://www.opensource.org/licenses/agpl-v3.html\">GNU Affero general Public License v3</a>, the code can be found on <a href=\"http://github.com/philou/FilooFiloo\">github</a>.</p><h2>Main third parties</h2><p><ul><li><a href=\"http://www.sproutcore.com/\">Sproutcore</a></li><li><a href=\"http://www.sinatrarb.com/\">Sinatra</a></li><li><a href=\"http://www.povray.org/\">POV Ray</a></li></ul></p><h2>Feedback</h2><p><a href=\"mailto:filoo.filoo.the.game@gmail.com\">filoo.filoo.the.game@gmail.com</a></p>"
  })
});
