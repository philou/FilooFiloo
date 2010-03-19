// Copyright (c) 2008-2010  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.

// You should have received a copy of the MIT License along with this
// program.  If not, see <http://www.opensource.org/licenses/mit-license.php>

// ========================================================================
// FilooFiloo.LoginController Unit Test
// ========================================================================


module("FilooFiloo.LoginController",{

  setup: function() {
    loginController = FilooFiloo.createLoginController();
    delete loginController.loginPaneVisibleDidChange;
  }
});


test("forceLoginAndDo should set up the login panel", function() {
    var closeLoginPaneCalled = NO;
    loginController.forceLoginAndDo('Test login', 'login, tester:', function() { closeLoginPaneCalled = YES; });

    equals('Test login',loginController.get('loginTitle'));
    equals('login, tester:',loginController.get('loginCaption'));
    equals(YES,loginController.get('loginTextRequired'));
    equals(YES,loginController.get('loginPaneVisible'));
    equals(NO,closeLoginPaneCalled);

    loginController.set('name', 'johnny be good');
    loginController.closeLoginPane();
    equals(NO,loginController.get('loginPaneVisible'));
    equals(YES,closeLoginPaneCalled);
});

test("The login pane should not be closed if no name was entered", function() {
    var closeLoginPaneCalled = NO;
    loginController.forceLoginAndDo('Test login', 'login, tester:', function() { closeLoginPaneCalled = YES; });
    loginController.closeLoginPane();
    equals(YES,loginController.get('loginPaneVisible'));
    equals(NO,closeLoginPaneCalled);
});

test("If already entered, the login pane should not ask for a name", function() {
    loginController.set('name', 'already');
    loginController.forceLoginAndDo('Test login', 'login, tester:', function() {});

    equals(NO,loginController.get('loginTextRequired'));
    equals(YES,loginController.get('loginPaneVisible'));
});
