// ==========================================================================
// Project:   FilooFiloo.BoardView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals FilooFiloo */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
FilooFiloo.BoardView = SC.View.extend(
/** @scope FilooFiloo.BoardView.prototype */ {

  render: function(context, firstTime)
  {
    context = context.begin('div').push('BoardView here !').end();

    sc_super();
  }

});
