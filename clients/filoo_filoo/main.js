// ==========================================================================
// FilooFiloo
// ==========================================================================

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
function main() {

  // Step 1: Load Your Model Data
  // The default code here will load the fixtures you have defined.
  // Comment out the preload line and add something to refresh from the server
  // when you are ready to pull data from your server.
  //FilooFiloo.server.preload(FilooFiloo.FIXTURES) ;
  FilooFiloo.server.listFor({ recordType: FilooFiloo.HighScore, order: "-score"});
  var scores = FilooFiloo.HighScore.collection();
  scores.set('orderBy', 'ranking');
  scores.refresh();
  if(scores.get('count') === 0){
    // sometimes, no scores are loaded ... maybe my netbook is too slow ???
    FilooFiloo.server.listFor({ recordType: FilooFiloo.HighScore, order: "-score"});
  }

  // TODO: refresh() any collections you have created to get their records.
  // ex: FilooFiloo.contacts.refresh() ;

  // Step 2: Instantiate Your Views
  // The default code just activates all the views you have on the page. If
  // your app gets any level of complexity, you should just get the views you
  // need to show the app in the first place, to speed things up.
  SC.page.awake() ;

  // Step 3. Set the content property on your primary controller.
  // This will make your app come alive!

  // TODO: Set the content property on your primary controller
  // ex: FilooFiloo.contactsController.set('content',FilooFiloo.contacts);
  FilooFiloo.highScoresController.set('content', scores);

  FilooFiloo.gameController.set('board', FilooFiloo.Board.create({
      ticker: FilooFiloo.Ticker.create(),
      colorProvider: FilooFiloo.ColorProvider.create()
  }));

} ;
