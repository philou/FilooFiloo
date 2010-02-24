// ==========================================================================
// Project:   FilooFiloo - credits page
// Copyright: ©2008-2009 Philippe Bourgau, Inc.
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

FilooFiloo.creditsPage = SC.Page.design(
  {

  mainView: SC.LabelView.design({
    layout: { top: 20, bottom: 0, centerX: 0, width: 300 },
    classNames: 'information',
    escapeHTML: NO,
    value: "<h2>Contributors</h2><p>This game was done by Philippe Bourgau, 2008-2009.</p><h2>Licence</h2><p><a href=\"http://\">MIT</a>, the code can be found <a href=\"http://www.opensource.org/licenses/mit-license.php\">here</a>.</p><h2>Main third parties</h2><p><ul><li><a href=\"http://www.sproutcore.com/\">Sproutcore</a></li><li><a href=\"http://rubyonrails.org/\">Rails</a></li><li><a href=\"http://www.povray.org/\">POV Ray</a></li></ul></p>"
  })
});
