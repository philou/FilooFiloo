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

// ========================================================================
// FilooFiloo.SingleController Unit Test
// ========================================================================

module("FilooFiloo.SingleController",{

  setup: function() {
    singleController = FilooFiloo.singleController;
    board = singleController.get('board');
    board.invokeLast = function(method) {
      this[method]();
    };
  }
});

test("Entering single mode should start a game", function() {
  ok(!board.get('playing'), "A game should not start on its own");
  singleController.set('currentMode', 'FilooFiloo.singlePage.mainView');

  ok(board.get('playing'), "Once in single mode, the game should have started");
});

test("Leaving single mode should end the game", function() {
  singleController.set('currentMode', 'FilooFiloo.singlePage.mainView');

  singleController.set('currentMode', 'FilooFiloo.menuPage.mainView');
  ok(!board.get('playing'), "After single mode is left, the game should have ended");
});