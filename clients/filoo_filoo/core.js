// Copyright (c) 2008-2009  Philippe Bourgau

// This program is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
// License for more details.

// You should have received a copy of the MIT License along with this
// program.  If not, see <http://www.opensource.org/licenses/mit-license.php>


// ==========================================================================
// FilooFiloo
// ==========================================================================

FilooFiloo = SC.Object.create({

  // This will create the server for your application.  Add any namespaces
  // your model objects are defined in to the prefix array.
    server: SC.Server.create({ prefix: ['FilooFiloo'], urlFormat: "/sc/%@/%@/" }),

  // When you are in development mode, this array will be populated with
  // any fixtures you create for testing and loaded automatically in your
  // main method.  When in production, this will be an empty array.
  FIXTURES: []

}) ;
