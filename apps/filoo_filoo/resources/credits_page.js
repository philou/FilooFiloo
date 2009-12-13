// ==========================================================================
// Project:   FilooFiloo - credits page
// Copyright: ©2008-2009 Philippe Bourgau, Inc.
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

FilooFiloo.creditsPage = SC.Page.design({

  mainView: SC.LabelView.design({
    escapeHTML: NO,
    classNames: 'information',
    value: "<h2>Contributors</h2><p>This game was done by Philippe Bourgau, 2008-2009.</p><h2>Licence</h2><p><a href=\"http://\">GNU Affero General Public License</a>, the code can be found <a href=\"http://www.gnu.org/licenses/\">here</a>.</p><h2>Main third parties</h2><p><ul><li><a href=\"http://www.sproutcore.com/\">Sproutcore</a></li><li><a href=\"http://rubyonrails.org/\">Rails</a></li><li><a href=\"http://www.povray.org/\">POV Ray</a></li></ul></p>"
  })
});
