(function(){var a="sproutcore/standard_theme";if(!SC.BUNDLE_INFO){throw"SC.BUNDLE_INFO is not defined!"
}if(SC.BUNDLE_INFO[a]){return}SC.BUNDLE_INFO[a]={requires:["sproutcore/empty_theme"],styles:["/static/sproutcore/standard_theme/en/LATEST/stylesheet-packed.css","/static/sproutcore/standard_theme/en/LATEST/stylesheet.css"],scripts:["/static/sproutcore/standard_theme/en/LATEST/javascript-packed.js"]}
})();FilooFiloo=SC.Application.create({NAMESPACE:"FilooFiloo",VERSION:"0.1.0",store:SC.Store.create().from("FilooFiloo.MainDataSource")});
FilooFiloo.highScoresController=SC.ArrayController.create({orderBy:"ranking"});FilooFiloo.createLoginController=function(){return SC.Object.create({name:undefined,loginPaneVisible:NO,loginTextRequired:YES,loginTitle:"Login",loginCaption:"Please choose a surname.",_doAfterLogin:null,forceLoginAndDo:function(b,c,a){this.set("loginTitle",b);
this.set("loginCaption",c);this._doAfterLogin=a;this.set("loginTextRequired",!this.get("name"));
this.set("loginPaneVisible",YES)},closeLoginPane:function(){if(this.get("name")){this.set("loginPaneVisible",NO);
this._doAfterLogin(this.get("name"))}},loginPaneVisibleDidChange:function(){var a=FilooFiloo.mainPage.get("loginPane");
if(this.get("loginPaneVisible")){a.append()}else{a.remove()}}})};FilooFiloo.loginController=FilooFiloo.createLoginController();
FilooFiloo.loginController.addObserver("loginPaneVisible",FilooFiloo.loginController,"loginPaneVisibleDidChange");
FilooFiloo.menuController=SC.ObjectController.create({nowShowing:"FilooFiloo.menuPage.mainView",singleGame:function(){this.setNowShowing("single")
},versusGame:function(){this.setNowShowing("versus")},highScores:function(){this.setNowShowing("highScores")
},rules:function(){this.setNowShowing("rules")},credits:function(){this.setNowShowing("credits")
},backToMenu:function(){this.setNowShowing("menu")},setNowShowing:function(a){this.set("nowShowing","FilooFiloo."+a+"Page.mainView")
}});FilooFiloo.Game=SC.Object.extend({});FilooFiloo.Game.Clear=null;FilooFiloo.Game.Junk="junk";
FilooFiloo.Game.Red="red";FilooFiloo.Game.Green="green";FilooFiloo.Game.Blue="blue";
FilooFiloo.Game.Purple="purple";FilooFiloo.Game.Yellow="yellow";FilooFiloo.Game.Colors=[FilooFiloo.Game.Red,FilooFiloo.Game.Green,FilooFiloo.Game.Blue,FilooFiloo.Game.Purple,FilooFiloo.Game.Yellow];
FilooFiloo.Game.initialToState={};FilooFiloo.Game.stateToInitial={};FilooFiloo.Game.stateToName={};
FilooFiloo.Game.registerStateWithDetails=function(c,b,a){b=b||c[0];FilooFiloo.Game.initialToState[b]=c;
FilooFiloo.Game.stateToInitial[c]=b;FilooFiloo.Game.stateToName[c]=a};FilooFiloo.Game.registerState=function(a){FilooFiloo.Game.registerStateWithDetails(a,a[0],a)
};FilooFiloo.Game.registerStateWithDetails(FilooFiloo.Game.Clear," ","clear");FilooFiloo.Game.Colors.forEach(FilooFiloo.Game.registerState);
FilooFiloo.Game.registerState(FilooFiloo.Game.Junk);FilooFiloo.Game.ColCount=6;FilooFiloo.Game.RowCount=12;
FilooFiloo.Game.StartTickerInterval=500;FilooFiloo.Game.LevelAcceleration=0.9;FilooFiloo.Game.LevelUpgrade=30;
FilooFiloo.Ticker=SC.Object.extend({start:function(a){FilooFiloo.assert(!this.timer);
FilooFiloo.assert(!this.game);FilooFiloo.assert(a);this.game=a;this.timer=SC.Timer.schedule({target:this.game,action:"tick",repeats:YES,interval:this.interval_(a.get("level"))})
},stop:function(){this.timer.invalidate();delete (this.timer);delete (this.game)},setLevel:function(a){if(this.timer){this.timer.set("interval",this.interval_(a))
}},interval_:function(a){return Math.floor(FilooFiloo.Game.StartTickerInterval*Math.pow(FilooFiloo.Game.LevelAcceleration,a-1))
}});FilooFiloo.ColorProvider=SC.Object.extend({randomColor_:function(){var a=FilooFiloo.Game.Colors;
var b=FilooFiloo.Random.randomInteger(a.length);return a[b]},popFirstColor:function(){return this.randomColor_()
},popSecondColor:function(){return this.randomColor_()}});FilooFiloo.Random={randomInteger:function(a){return Math.floor(Math.random()*a)%a
},nextFreeIndex:function(d,c){var b=d.length;var a=c;while(a<b&&d[a]){a++}return a
},nthFreeIndex:function(e,d){var b=e.length;var a=0;for(var c=0;c<=d;c++){a=this.nextFreeIndex(e,a);
if(c!=d){a++}}if(b<=a){return -1}return a},randomUniqueIntegers:function(f,b){var e=[];
var c=0;for(c=0;c<b;c++){e[c]=NO}for(c=0;c<f;c++){var d=this.randomInteger(b-c);e[this.nthFreeIndex(e,d)]=YES
}var a=[];for(c=0;c<b;c++){if(e[c]){a.push(c)}}return a}};require("models/game");
require("models/ticker");require("models/color_provider");require("models/random");
FilooFiloo.Board=SC.Object.extend({playing:false,gameOver:null,disappearedPieces:0,score:0,level:function(){return Math.floor(this.get("disappearedPieces")/FilooFiloo.Game.LevelUpgrade)+1
}.property("disappearedPieces"),getTicker:function(){if(!this.ticker){this.ticker=FilooFiloo.Ticker.create()
}return this.ticker},getColorProvider:function(){if(!this.colorProvider){this.colorProvider=FilooFiloo.ColorProvider.create()
}return this.colorProvider},columnPicker:FilooFiloo.Random,init:function(){arguments.callee.base.apply(this,arguments);
for(var a=0;a<FilooFiloo.Board.ColCount;a++){for(var b=0;b<FilooFiloo.Board.RowCount;
b++){this.set(FilooFiloo.Board.cellProperty(a,b),FilooFiloo.Game.Clear)}}},start:function(a){a=a||FilooFiloo.CoordMap.create();
this.set("disappearedPieces",0);this.set("score",0);this.set("playing",true);this.getTicker().start(this);
this.setBlockedPieces_(a);this.setCurrentPiece_(null);this.scoringPieces=0;this.junkCount=0;
this.onNextTick="initCurrentPiece_"},abort:function(){this.getTicker().stop();this.set("playing",false)
},cellState:function(b,c){if(this.currentPiece){var a=this.currentPiece.cellState(b,c);
if(a){return a}}if(this.blockedPieces){var a=this.blockedPieces.getAt(b,c);if(a){return a
}}return FilooFiloo.Game.Clear},tick:function(){FilooFiloo.assert(this[this.onNextTick]);
this.onNextTick=this[this.onNextTick]();FilooFiloo.assert(!this.onNextTick||this[this.onNextTick])
},left:function(){this.moveCurrentPiece_("left")},right:function(){this.moveCurrentPiece_("right")
},rotate:function(){this.moveCurrentPiece_("rotate")},antiRotate:function(){this.moveCurrentPiece_("antiRotate")
},drop:function(){if(this.currentPiece){this.onNextTick=this.blockCurrentPiece_()
}},addJunk:function(a){this.junkCount+=a},moveCurrentPiece_:function(a){if(this.currentPiece){var b=this.currentPiece[a]();
if(this.pieceIsAllowed_(b)){this.setCurrentPiece_(b);return true}}return false},notifyChanged_:function(){for(var a=0;
a<FilooFiloo.Board.ColCount;a++){for(var b=0;b<FilooFiloo.Board.RowCount;b++){this.setIfChanged(FilooFiloo.Board.cellProperty(a,b),this.cellState(a,b))
}}},now_:function(){return new Date()},gameOver_:function(){this.abort();this.set("gameOver",this.now_())
},initCurrentPiece_:function(a){var b=10*this.scoringPieces*(this.scoringPieces-3);
this.set("score",this.get("score")+b);this.scoringPieces=0;if(0<this.junkCount){return this.dumpJunk_()
}else{return this.createNewPiece_()}},dumpJunk_:function(){var f=this;var a="createNewPiece_";
var h=Math.min(FilooFiloo.Board.MaxJunkLoad,this.junkCount);var e=Math.floor(h/FilooFiloo.Board.ColCount);
var g=h%FilooFiloo.Board.ColCount;var d=function(c){if(!f.cellIsAllowed_(0,c)){a=null;
f.gameOver_();return}f.dropCell_(0,c,FilooFiloo.Game.Junk)};for(var b=0;b<e;b++){for(var j=0;
j<FilooFiloo.Board.ColCount;j++){d(j)}}this.columnPicker.randomUniqueIntegers(g,FilooFiloo.Board.ColCount).forEach(d);
this.junkCount-=h;this.notifyChanged_();return a},createNewPiece_:function(){var a=FilooFiloo.Piece.create({center:FilooFiloo.Board.PieceStartOrigin,colors:{first:this.getColorProvider().popFirstColor(),second:this.getColorProvider().popSecondColor()}});
if(!this.pieceIsAllowed_(a)){this.gameOver_();return null}this.setCurrentPiece_(a);
return"tickCurrentPiece_"},tickCurrentPiece_:function(){FilooFiloo.assert(this.currentPiece);
if(!this.moveCurrentPiece_("down")){return this.blockCurrentPiece_()}return"tickCurrentPiece_"
},setCurrentPiece_:function(a){this.currentPiece=a;this.notifyChanged_()},cellIsAllowed_:function(b,a){return(0<=b)&&(b<=FilooFiloo.Board.MaxRow)&&(0<=a)&&(a<=FilooFiloo.Board.MaxCol)&&!this.blockedPieces.getAt(a,b)
},pieceIsAllowed_:function(b){var a=true;var c=this;b.forEach(function(e,d){a&=c.cellIsAllowed_(e,d)
});return a},blockCurrentPiece_:function(){var a=this;this.currentPiece.forEach(function(d,c,b){a.dropCell_(d,c,b)
});this.setCurrentPiece_(null);return"cleanBlockedPieces_"},dropCell_:function(c,b,a){while(this.cellIsAllowed_(c+1,b)){c=c+1
}this.blockedPieces.put(b,c,a)},setBlockedPieces_:function(a){this.blockedPieces=a
},finializeCurrentPiece:function(d,e){var g=NO;for(var a=FilooFiloo.Board.MaxRow;
0<=a;--a){for(var f=0;f<=FilooFiloo.Board.MaxCol;++f){var b=d(f,a);if(b){g=YES;b(f,a)
}}}if(g){this.notifyChanged_();return e}return this.initCurrentPiece_()},cleanBlockedPieces_:function(){var a=this;
return this.finializeCurrentPiece(function(f,d){var e=a.cellState(f,d);var b=a.blockedPieces.pieceContaining(f,d);
if((FilooFiloo.Game.Junk!=e)&&(4<=b.get("count"))){return function(){a.set("disappearedPieces",a.get("disappearedPieces")+b.get("count"));
a.scoringPieces=a.scoringPieces+b.get("count");a.blockedPieces.removeEach(b);a.cleanSurroundingJunk_(b)
}}return null},"collapseBlockedPieces_")},cleanSurroundingJunk_:function(b){var a=this;
b.surroundingPiece(YES).each(function(c,d){if(FilooFiloo.Board.areValidCoordinates(c,d)&&FilooFiloo.Game.Junk==a.cellState(c,d)){a.blockedPieces.remove(c,d)
}})},collapseBlockedPieces_:function(){var a=this;return this.finializeCurrentPiece(function(d,b){if(a.blockedPieces.getAt(d,b)&&a.cellIsAllowed_(b+1,d)){return function(){var c=a.blockedPieces.getAt(d,b);
a.blockedPieces.remove(d,b);a.dropCell_(b,d,c)}}return null},"cleanBlockedPieces_")
},forwardLevelToTheTicker:function(){this.getTicker().setLevel(this.get("level"))
}.observes("level"),cellsToString:function(){result=[];for(row=0;row<FilooFiloo.Board.RowCount;
row++){for(col=0;col<FilooFiloo.Board.ColCount;col++){result.push(FilooFiloo.Game.stateToInitial[this.cellState(col,row)])
}result.push("\n")}return result.join("")}});FilooFiloo.Board.MaxJunkLoad=30;FilooFiloo.Board.setMaxJunkLoad=function(a){this.MaxJunkLoad=a
};FilooFiloo.Board.setDimensions=function(b,a){this.ColCount=b;this.MaxCol=b-1;this.RowCount=a;
this.MaxRow=a-1;this.PieceStartOrigin={row:0,col:this.ColCount/2-1}};FilooFiloo.Board.areValidCoordinates=function(a,b){return 0<=a&&a<=this.MaxCol&&0<=b&&b<=this.MaxRow
};FilooFiloo.Board.setDimensions(FilooFiloo.Game.ColCount,FilooFiloo.Game.RowCount);
FilooFiloo.Board.cellProperty=function(a,b){return"cell-"+(b*FilooFiloo.Board.ColCount+a)
};FilooFiloo.HighScore=SC.Record.extend({playerName:SC.Record.attr(String),score:SC.Record.attr(Number),summary:function(){return this.get("playerName")+": "+this.get("score")
}.property("playerName","score"),ranking:function(){return -this.get("score")}.property("score")});
sc_require("models/board");sc_require("models/high_score");FilooFiloo.singleController=SC.Object.create({board:FilooFiloo.Board.create(),gameOver:function(){if(this.get("board").get("gameOver")){var a=this;
FilooFiloo.loginController.forceLoginAndDo("Game Over","Filoo Filoo rules... but you somewhat managed to reach the high scores !",function(c){var b={playerName:c,score:a.get("board").get("score")};
var d=FilooFiloo.store.createRecord(FilooFiloo.HighScore,b);d.commitRecord()})}}.observes(".board.gameOver"),currentModeObserver:function(){var a=this.get("board");
if(("FilooFiloo.singlePage.mainView"===this.get("currentMode"))&&(!a.get("playing"))){a.invokeLast("start")
}else{if(a.get("playing")){a.abort()}}}.observes("currentMode"),nowShowingObserver:function(){this.set("currentMode",FilooFiloo.menuController.get("nowShowing"))
}.observes("FilooFiloo.menuController.nowShowing")});FilooFiloo.Player=SC.Record.extend({name:SC.Record.attr(String),opponent:SC.Record.toOne("FilooFiloo.Player",{inverse:"opponent",isMaster:YES}),boardString:SC.Record.attr(String),score:SC.Record.attr(Number),outcome:SC.Record.attr(String)});
FilooFiloo.Player.WIN="win";FilooFiloo.Player.LOST="lost";FilooFiloo.Player.TIMEOUT="timeout";
FilooFiloo.ReadOnlyBoard=SC.Object.extend({boardString:"",playing:NO,init:function(){arguments.callee.base.apply(this,arguments);
this.updateCells()},boardStringObserver:function(){this.updateCells(this.get("boardString"))
}.observes("boardString"),updateCells:function(f){if(!f){for(var b=0;b<FilooFiloo.Board.ColCount;
b++){for(var e=0;e<FilooFiloo.Board.RowCount;e++){this.set(FilooFiloo.Board.cellProperty(b,e),FilooFiloo.Game.Clear)
}}return}var c=f.split("\n");for(var d=0;d<c.length;d++){var e=c[d];for(var a=0;a<e.length;
a++){this.setIfChanged(FilooFiloo.Board.cellProperty(a,d),FilooFiloo.Game.initialToState[e.charAt(a)])
}}}});sc_require("models/player");sc_require("models/board");sc_require("models/read_only_board");
sc_require("controllers/menu");FilooFiloo.VersusController={PENDING:"pending",WAITING:"waiting for opponent",PLAYING:"playing",FINISHED:"finished"};
FilooFiloo.createVersusController=function(){return SC.Object.create({board:FilooFiloo.Board.create(),opponentBoard:FilooFiloo.ReadOnlyBoard.create(),currentMode:undefined,player:undefined,opponent:undefined,waitingTime:undefined,opponentScore:undefined,timer:undefined,Timer:SC.Timer,store:FilooFiloo.store,gameStatus:function(){var b=this.get("player");
var a=this.get("opponent");if((b&&b.get("outcome"))||(a&&a.get("outcome"))){return FilooFiloo.VersusController.FINISHED
}else{if(a){return FilooFiloo.VersusController.PLAYING}else{if(undefined!=this.get("waitingTime")){return FilooFiloo.VersusController.WAITING
}else{return FilooFiloo.VersusController.PENDING}}}}.property("waitingTime","opponent","opponentOutcome","player","playerOutcome"),whatIsPlayerDoing:function(){switch(this.get("gameStatus")){case FilooFiloo.VersusController.FINISHED:var a=this.get("opponent");
if(!a){return"Could not find any opponent, try again later !"}else{return this.outcomeToString()+" against "+this.get("opponent").get("name")
}case FilooFiloo.VersusController.PLAYING:return"Playing against "+this.get("opponent").get("name");
case FilooFiloo.VersusController.WAITING:return"Waiting for an opponent ... "+this.get("waitingTime")+" seconds";
default:return"pending"}}.property("gameStatus"),whatIsPlayerDoingPaneVisible:function(){if(this.get("currentMode")!="FilooFiloo.versusPage.mainView"){return NO
}switch(this.get("gameStatus")){case FilooFiloo.VersusController.WAITING:case FilooFiloo.VersusController.FINISHED:return YES;
default:return NO}}.property("gameStatus"),outcomeToString:function(){switch(this.get("opponentOutcome")){case FilooFiloo.Player.TIMEOUT:return"Timeout";
case FilooFiloo.Player.LOST:return"Won";default:return"Lost"}},asSoonAsEditable:function(a,b){if(a.get("isEditable")){b()
}else{a.addObserver("isEditable",{isEditableObserver:function(){if(a.get("isEditable")){b();
a.removeObserver("isEditable",this,"isEditableObserver")}}},"isEditableObserver")
}},currentModeObserver:function(){var a=this.get("player");if("FilooFiloo.versusPage.mainView"===this.get("currentMode")){this.requestLogin()
}else{if(a){this.stopTheGame();this.reset();this.asSoonAsEditable(a,function(){a.set("outcome",FilooFiloo.Player.TIMEOUT);
a.commitRecord()})}}}.observes("currentMode"),nowShowingObserver:function(){this.set("currentMode",FilooFiloo.menuController.get("nowShowing"))
}.observes("FilooFiloo.menuController.nowShowing"),requestLogin:function(){if(!FilooFiloo.loginController.get("name")){var a=this;
FilooFiloo.loginController.forceLoginAndDo("Login","Filoo Filoo rules... you need to login in order to play against someone.",function(){a._startWaitingForOpponent()
})}else{this._startWaitingForOpponent()}},_startWaitingForOpponent:function(){this.set("player",this.store.createRecord(FilooFiloo.Player,{name:FilooFiloo.loginController.get("name")}));
this.playerOutcomeBinding=SC.Binding.from("player.outcome",this).to("playerOutcome",this).connect();
this.get("player").commitRecord();this.set("waitingTime",0);this.set("timer",this.Timer.schedule({target:this,action:"_checkForOpponent",repeats:YES,interval:1000}));
this.addObserver("player.opponent",this,"playerOpponentObserver")},_checkForOpponent:function(){this.incrementProperty("waitingTime");
if(this.get("player").get("isEditable")){this.get("player").refresh()}},playerOpponentObserver:function(){var a=this.get("player").get("opponent");
if(a&&a.get("name")){this.removeObserver("player.opponent",this,"playerOpponentObserver");
this.set("opponent",a);this.get("timer").set("interval",3131);this.get("timer").set("action","_updatePlayers");
this.get("board").start();this.boardStringBinding=SC.Binding.from("opponent.boardString",this).to("opponentBoard.boardString",this).connect();
this.opponentOutcomeBinding=SC.Binding.from("opponent.outcome",this).to("opponentOutcome",this).connect();
this.set("opponentScore",0);this.addObserver("opponent.score",this,"opponentScoreObserver")
}},_updatePlayers:function(){var a=this.get("opponent");if(a.get("outcome")){this.stopTheGame();
return}var b=this.get("player");if(b.get("isEditable")){b.set("boardString",this.get("board").cellsToString());
b.set("score",this.get("board").get("score"));if(this.get("board").get("gameOver")){b.set("outcome",FilooFiloo.Player.LOST)
}b.commitRecord()}a.refresh()},opponentScoreObserver:function(){var b=this.get("opponent").get("score");
var a=b-this.get("opponentScore");this.get("board").addJunk(Math.ceil(a/70));this.set("opponentScore",b)
},stopTheGame:function(){if(this.get("timer")){this.get("timer").invalidate()}var b=this;
["boardStringBinding","playerOutcomeBinding","opponentOutcomeBinding"].forEach(function(c){if(b[c]){b[c].disconnect();
delete b[c]}});this.removeObserver("opponent.score",this,"opponentScoreObserver");
this.removeObserver("player.opponent",this,"playerOpponentObserver");var a=this.get("board");
if(a.get("playing")){a.abort()}},reset:function(){var a=this;["timer","player","opponent","waitingTime","opponentScore"].forEach(function(b){a.set(b,undefined)
})},whatIsPlayerDoingPaneVisibleDidChange:function(){var a=FilooFiloo.versusPage.get("whatIsPlayerDoingPane");
if(this.get("whatIsPlayerDoingPaneVisible")){a.append()}else{a.remove()}}})};FilooFiloo.versusController=FilooFiloo.createVersusController();
FilooFiloo.versusController.addObserver("whatIsPlayerDoingPaneVisible",FilooFiloo.versusController,"whatIsPlayerDoingPaneVisibleDidChange");
FilooFiloo.CoordMap=SC.Object.extend({count:0,getAt:function(a,c){var b=this.values_()[this.key_(a,c)];
if(!b){return null}return b.value},put:function(a,c,b){if(b){if(!this.values_()[this.key_(a,c)]){this.count++
}this.values_()[this.key_(a,c)]={x:a,y:c,value:b}}else{this.remove(a,c)}},each:function(c){for(var a in this.values_()){var b=this.values_()[a];
c(b.x,b.y,b.value)}},remove:function(a,b){if(this.getAt(a,b)){this.count--}delete (this.values_()[this.key_(a,b)])
},removeEach:function(a){FilooFiloo.assert(a);var b=this;a.each(function(c,d){b.remove(c,d)
})},equals:function(b){if(b.get("count")!==this.get("count")){return false}var a=true;
this.each(function(c,e,d){a&=(d===b.getAt(c,e))});return a},pieceContaining:function(a,b){return this.collectPieceContaining_(a,b,FilooFiloo.CoordMap.create())
},neighbors_:function(a,b){return[{x:a-1,y:b},{x:a+1,y:b},{x:a,y:b-1},{x:a,y:b+1}]
},collectPieceContaining_:function(b,e,a){FilooFiloo.assert(a);var c=this;if(!a.getAt(b,e)){var d=this.getAt(b,e);
if(d){a.put(b,e,d);this.neighbors_(b,e).forEach(function(f){c.collectPieceIfValue_(d,f.x,f.y,a)
})}}return a},collectPieceIfValue_:function(c,b,d,a){if(c===this.getAt(b,d)){this.collectPieceContaining_(b,d,a)
}return a},values_:function(){if(!this.values){this.values={}}return this.values},key_:function(a,b){return a+";"+b
},surroundingPiece:function(c){var a=FilooFiloo.CoordMap.create();var b=this;this.each(function(d,e){b.neighbors_(d,e).forEach(function(f){if(!b.getAt(f.x,f.y)){a.put(f.x,f.y,c)
}})});return a}});require("models/game");FilooFiloo.Piece=SC.Object.extend({center:{row:0,col:0},colors:{first:FilooFiloo.Game.Red,second:FilooFiloo.Game.Red},orientation:"Right",cellState:function(a,b){if((this.center.row===b)&&(this.center.col===a)){return this.colors.first
}if((this.secondCell_().row===b)&&(this.secondCell_().col===a)){return this.colors.second
}return FilooFiloo.Game.Clear},forEach:function(a){if("Down"===this.orientation){a(this.secondCell_().row,this.secondCell_().col,this.colors.second);
a(this.center.row,this.center.col,this.colors.first)}else{a(this.center.row,this.center.col,this.colors.first);
a(this.secondCell_().row,this.secondCell_().col,this.colors.second)}},down:function(){return FilooFiloo.Piece.create({center:{row:this.center.row+1,col:this.center.col},colors:this.colors,orientation:this.orientation})
},left:function(){return FilooFiloo.Piece.create({center:{row:this.center.row,col:this.center.col-1},colors:this.colors,orientation:this.orientation})
},right:function(){return FilooFiloo.Piece.create({center:{row:this.center.row,col:this.center.col+1},colors:this.colors,orientation:this.orientation})
},rotate:function(){return FilooFiloo.Piece.create({center:{row:this.center.row,col:this.center.col},colors:this.colors,orientation:this.rotateOrientation_(this.orientation)})
},antiRotate:function(){return FilooFiloo.Piece.create({center:{row:this.center.row,col:this.center.col},colors:this.colors,orientation:this.antiRotateOrientation_(this.orientation)})
},secondCell_:function(){switch(this.orientation){case"Right":return{row:this.center.row,col:this.center.col+1};
case"Up":return{row:this.center.row-1,col:this.center.col};case"Left":return{row:this.center.row,col:this.center.col-1};
case"Down":return{row:this.center.row+1,col:this.center.col}}throw"unexpected orientation"
},rotateOrientation_:function(a){switch(a){case"Right":return"Up";case"Up":return"Left";
case"Left":return"Down";case"Down":return"Right"}throw"unexpected orientation"},antiRotateOrientation_:function(a){switch(a){case"Right":return"Down";
case"Up":return"Right";case"Left":return"Up";case"Down":return"Left"}throw"unexpected orientation"
}});FilooFiloo.Layout={MAIN_VIEW:{top:12,bottom:12,centerX:0,width:300},SCORE_ROW_HEIGHT:24,scoreGridRowTop:function(a){return a*this.SCORE_ROW_HEIGHT
},scoreGridHeight:function(a){return a*this.SCORE_ROW_HEIGHT},scoreRowLayout:function(a){return{top:this.scoreGridRowTop(a),height:this.SCORE_ROW_HEIGHT,left:0,right:0}
},scoreItemViews:function(b,c,a){return[SC.LabelView.design({layout:this.scoreRowLayout(b),textAlign:SC.ALIGN_CENTER,fontWeight:SC.BOLD_WEIGHT,value:c}),SC.LabelView.design({layout:this.scoreRowLayout(b+1),textAlign:SC.ALIGN_CENTER,fontWeight:SC.BOLD_WEIGHT,value:"0",valueBinding:a})]
},scoreViews:function(b){var a=[];a=a.concat(this.scoreItemViews(0,"Score",b+".score"));
a=a.concat(this.scoreItemViews(3,"Filoos",b+".disappearedPieces"));a=a.concat(this.scoreItemViews(6,"Level",b+".level"));
return a},detailedBoardView:function(b,a){a.width=321;a.height=395;return SC.View.design(SC.Border,{classNames:["main-view"],layout:a,borderStyle:SC.BORDER_GRAY,childViews:"scoresView boardView".w(),scoresView:SC.View.design({classNames:["scores"],layout:{left:12,width:100,centerY:0,height:this.scoreGridHeight(8)},childViews:this.scoreViews(b)}),boardView:FilooFiloo.BoardView.design({layout:{right:12,centerY:0,width:185,height:371},contentBinding:b})})
}};sc_require("views/layout");FilooFiloo.highScoresPage=SC.Page.design({mainView:SC.View.design({classNames:["main-view"],layout:FilooFiloo.Layout.MAIN_VIEW,childViews:[SC.LabelView.design({layout:{top:0,height:24,left:0,right:0},textAlign:SC.ALIGN_CENTER,fontWeight:SC.BOLD_WEIGHT,value:"Hall of fame"}),SC.ScrollView.design({hasHorizontalScroller:NO,layout:{top:48,bottom:0,left:12,right:12},contentView:SC.ListView.design({contentBinding:"FilooFiloo.highScoresController.arrangedObjects",selectionBinding:"FilooFiloo.highScoresController.selection",contentValueKey:"summary"})})]})});
FilooFiloo.assert=function(b,a){a=a||"Assertion failed.";if(!b){throw a}};var idem="no change";
FilooFiloo.TestsHelpers={assertStringRows:function(b,d,e,a,g){equals(d,b.length,g+", row count is different");
for(var f=0;f<d;++f){equals(e,b[f].length,g+", col count is different at row "+f);
for(var h=0;h<e;++h){equals(a(h,f),FilooFiloo.Game.initialToState[b[f][h]],g+" at (col="+h+", row="+f+")")
}}},newCoordMap:function(b){var a=FilooFiloo.CoordMap.create();for(var d=0;d<b.length;
++d){for(var e=0;e<b[d].length;++e){a.put(e,d,FilooFiloo.Game.initialToState[b[d][e]])
}}return a},transpose:function(d,c){var a=[];var b=0;for(b=0;b<c;++b){a[b]=[]}equals(0,d.length%c);
for(b=0;b<d.length;++b){if(d[b]===idem){a[b%c]=idem}else{a[b%c].push(d[b])}}return a
},times:function(c,b){for(var a=0;a<c;++a){b()}}};sc_require("models/game");FilooFiloo.createCellView=function(a,b){return SC.View.extend(SC.ContentDisplay,{classNames:["cell-view","cell"],tagName:"div",contentDisplayProperties:["playing",FilooFiloo.Board.cellProperty(a,b)],cellProperty:FilooFiloo.Board.cellProperty(a,b),render:function(c,e){var d=this.get("content");
if(d){c.addClass(FilooFiloo.Game.stateToName[d.get(this.cellProperty)])}}})};sc_require("views/cell");
FilooFiloo.BoardView=SC.View.extend({classNames:["board-view"],acceptsFirstResponder:YES,childViews:function(){var b=[];
for(var c=0;c<FilooFiloo.Board.ColCount;c++){for(var d=0;d<FilooFiloo.Board.RowCount;
d++){var a=FilooFiloo.createCellView(c,d).design({layout:{width:30,height:30,left:31*c,top:31*d}});
b.push(a)}}return b}(),contentObserver:function(){var c=this.get("content");var d=this.get("childViews");
var a=d.length;for(var b=0;b<a;b++){d[b].set("content",c)}}.observes("content"),focus:function(){var a=this.get("content");
if(a&&a.get("playing")){this.becomeFirstResponder()}else{this.resignFirstResponder()
}}.observes("content",".content.playing"),keyDown:function(a){return this.interpretKeyEvents(a)
},moveRight:function(b,a){this.get("content").right();return true},moveLeft:function(b,a){this.get("content").left();
return true},moveUp:function(b,a){this.get("content").rotate();return true},moveDown:function(b,a){this.get("content").antiRotate();
return true},insertText:function(a){if(" "===a){this.get("content").drop();return true
}return false}});FilooFiloo.creditsPage=SC.Page.design({mainView:SC.LabelView.design({layout:FilooFiloo.Layout.MAIN_VIEW,classNames:["main-view","information"],escapeHTML:NO,value:'<h2>Contributors</h2><p>This game was done by Philippe Bourgau, 2008-2010.</p><h2>Licence</h2><p><a href="http://www.opensource.org/licenses/agpl-v3.html">GNU Affero general Public License v3</a>, the code can be found on <a href="http://github.com/philou/FilooFiloo">github</a>.</p><h2>Main third parties</h2><p><ul><li><a href="http://www.sproutcore.com/">Sproutcore</a></li><li><a href="http://www.sinatrarb.com/">Sinatra</a></li><li><a href="http://www.povray.org/">POV Ray</a></li></ul></p><h2>Feedback</h2><p><a href="mailto:filoo-filoo@gmail.com">filoo-filoo@gmail.com</a></p>'})});
FilooFiloo.mainPage=SC.Page.design({mainPane:SC.MainPane.design({childViews:"headerView contentView footerView".w(),headerView:SC.ToolbarView.design({layout:{top:0,left:0,right:0,height:36},anchorLocation:SC.ANCHOR_TOP,childViews:[SC.LabelView.design({classNames:["filoo-filoo-title"],value:"Philou's Filoo-Filoo",layout:{centerY:0,left:12,height:24},fontWeight:SC.BOLD_WEIGHT}),SC.TextFieldView.design({hint:"login here",layout:{centerY:0,right:12,height:24,width:200},valueBinding:"FilooFiloo.loginController.name"})]}),contentView:SC.ContainerView.design({classNames:["filoo-filoo-container-view"],layout:{left:0,right:0,top:36,bottom:36},nowShowingBinding:"FilooFiloo.menuController.nowShowing"}),footerView:SC.ToolbarView.design({layout:{bottom:0,left:0,right:0,height:36},anchorLocation:SC.ANCHOR_BOTTOM,childViews:[SC.ButtonView.design({layout:{centerY:0,height:24,left:12,width:200},title:"Back to menu",target:"FilooFiloo.menuController",action:"backToMenu"}),SC.LabelView.design({value:"Philippe Bourgau 2008-2010",textAlign:SC.ALIGN_RIGHT,layout:{centerY:0,height:24,right:12,width:200}})]})}),loginPane:SC.SheetPane.create({layout:{width:400,height:200,centerX:0},contentView:SC.View.extend({layout:{top:0,left:0,bottom:0,right:0},childViews:[SC.LabelView.extend({layout:{height:36,top:10,left:10,right:10},textAlign:SC.ALIGN_CENTER,valueBinding:"FilooFiloo.loginController.loginTitle"}),SC.LabelView.extend({layout:{height:50,top:50,left:10,right:10},textAlign:SC.ALIGN_CENTER,valueBinding:"FilooFiloo.loginController.loginCaption"}),SC.TextFieldView.extend({layout:{centerX:0,height:24,bottom:50,width:200},hint:"login here",valueBinding:"FilooFiloo.loginController.name",isVisibleBinding:"FilooFiloo.loginController.loginTextRequired"}),SC.ButtonView.extend({layout:{centerX:0,height:24,bottom:10,width:100},textAlign:SC.ALIGN_CENTER,title:"OK",action:"closeLoginPane",target:"FilooFiloo.loginController"})]})})});
FilooFiloo.MenuPage={MARGIN:12,CELL_HEIGHT:24,gridTop:function(a){return this.gridHeight(a)
},gridHeight:function(a){return this.MARGIN+(this.CELL_HEIGHT+this.MARGIN)*a},cellLayout:function(a){return{top:this.gridTop(a),height:this.CELL_HEIGHT,left:this.MARGIN,right:this.MARGIN}
}};FilooFiloo.menuPage=SC.Page.design({mainView:SC.View.design(SC.Border,{classNames:["main-view menu-view"],layout:{centerX:0,centerY:0,width:300,height:FilooFiloo.MenuPage.gridHeight(5)},borderStyle:SC.BORDER_GRAY,childViews:[SC.ButtonView.design({layout:FilooFiloo.MenuPage.cellLayout(0),title:"Solo game",target:"FilooFiloo.menuController",action:"singleGame"}),SC.ButtonView.design({layout:FilooFiloo.MenuPage.cellLayout(1),title:"Internet game",target:"FilooFiloo.menuController",action:"versusGame"}),SC.ButtonView.design({layout:FilooFiloo.MenuPage.cellLayout(2),title:"High scores",target:"FilooFiloo.menuController",action:"highScores"}),SC.ButtonView.design({layout:FilooFiloo.MenuPage.cellLayout(3),title:"Rules",target:"FilooFiloo.menuController",action:"rules"}),SC.ButtonView.design({layout:FilooFiloo.MenuPage.cellLayout(4),title:"Credits",target:"FilooFiloo.menuController",action:"credits"})]})});
FilooFiloo.rulesPage=SC.Page.design({mainView:SC.LabelView.design({layout:FilooFiloo.Layout.MAIN_VIEW,classNames:["main-view","information"],escapeHTML:NO,value:"<h2>Summary</h2><p>This point of this game is to make disappear the falling filoos buy grouping them by four or more of the same color.</p><p>The gameplay is tetris like, only the currend falling filoos can be controlled.</p><p>Two filoos are in the same group if they have the same color, and if they are in adjacent cells, diagonals do not work. This relation is transitive.</p><p>Unlike tetris, pieces always fall to the bottom, that means no 'hole' can appear in the stack of filoos. Particularly, when blocked, the current falling filoos can split in two.</p><p>It is possible to earn extra point by chaining disappearances: when a group disappears, the filoos on top of it fall down, what might cause new groups to be formed and to disapear aswell, and so on.</p><h2>Keys</h2><table><tr><td>up</td><td>rotate counter clockwise</td></tr><tr><td>down</td><td>rotate clockwise</td></tr><tr><td>right</td><td>move to the right</td></tr><tr><td>left</td><td>move the the left</td></tr><tr><td>space</td><td>drops to the bottom</td></tr></table>"})});
sc_require("views/layout");FilooFiloo.singlePage=SC.Page.design({mainView:FilooFiloo.Layout.detailedBoardView("FilooFiloo.singleController.board",{centerX:0,centerY:0})});
sc_require("views/layout");FilooFiloo.versusPage=SC.Page.design({mainView:SC.View.design({classNames:["main-view"],layout:{centerX:0,centerY:0,width:658,height:399},childViews:"playerView opponentView".w(),playerView:FilooFiloo.Layout.detailedBoardView("FilooFiloo.versusController.board",{left:0,centerY:0}),opponentView:SC.View.design(SC.Border,{layout:{right:0,centerY:0,width:321,height:395},borderStyle:SC.BORDER_GRAY,childViews:"nameView boardView".w(),nameView:SC.LabelView.design({layout:{right:12,centerY:0,width:100,height:24},textAlign:SC.ALIGN_CENTER,fontWeight:SC.BOLD_WEIGHT,valueBinding:"FilooFiloo.versusController.opponent.name"}),boardView:FilooFiloo.BoardView.design({layout:{left:12,centerY:0,width:185,height:371},contentBinding:"FilooFiloo.versusController.opponentBoard"})})}),whatIsPlayerDoingPane:SC.SheetPane.create({layout:{width:400,height:200,centerX:0},contentView:SC.View.extend({layout:{top:0,left:0,bottom:0,right:0},childViews:[SC.LabelView.extend({layout:{left:12,right:12,centerY:0,height:24},textAlign:SC.ALIGN_CENTER,fontWeight:SC.BOLD_WEIGHT,valueBinding:"FilooFiloo.versusController.whatIsPlayerDoing"}),SC.ButtonView.design({layout:{centerX:0,width:200,height:24,bottom:12},title:"Back to menu",target:"FilooFiloo.menuController",action:"backToMenu"})]})})});
sc_require("models/high_score");sc_require("models/player");FilooFiloo.HIGH_SCORES_QUERY=SC.Query.local(FilooFiloo.HighScore,{orderBy:"score"});
FilooFiloo.MainDataSource=SC.DataSource.extend({fetch:function(a,b){if(b===FilooFiloo.HIGH_SCORES_QUERY){SC.Request.getUrl("/high_scores").json().notify(this,"didFetchHighScores",a,b).send();
return YES}return NO},didFetchHighScores:function(b,a,c){if(SC.ok(b)){a.loadRecords(FilooFiloo.HighScore,b.get("body").content);
a.dataSourceDidFetchQuery(c)}else{a.dataSourceDidErrorQuery(c,b)}},handlesRecordType:function(a,b){return SC.kindOf(a.recordTypeFor(b),FilooFiloo.HighScore)||SC.kindOf(a.recordTypeFor(b),FilooFiloo.Player)
},recordTypeUrl:function(a,b){if(SC.kindOf(a.recordTypeFor(b),FilooFiloo.HighScore)){return"/high_scores"
}if(SC.kindOf(a.recordTypeFor(b),FilooFiloo.Player)){return"/players"}throw"unhandled record type."
},retrieveRecord:function(a,c){if(this.handlesRecordType(a,c)){var b=a.idFor(c);SC.Request.getUrl(b).json().notify(this,"didRetrieveRecord",a,c).send();
return YES}return NO},didRetrieveRecord:function(b,a,d){if(SC.ok(b)){var c=b.get("body").content;
a.dataSourceDidComplete(d,c)}else{a.dataSourceDidError(d,b)}},createRecord:function(a,b){if(this.handlesRecordType(a,b)){SC.Request.postUrl(this.recordTypeUrl(a,b)).json().notify(this,"didCreateRecord",a,b).send(a.readDataHash(b));
return YES}return NO},didCreateRecord:function(b,a,d){if(SC.ok(b)){var e=/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
var c=e.exec(b.header("Location"))[8];a.dataSourceDidComplete(d,null,c)}else{a.dataSourceDidError(d,b)
}},updateRecord:function(a,b){if(this.handlesRecordType(a,b)){SC.Request.putUrl(a.idFor(b)).json().notify(this,this.didUpdateRecord,a,b).send(a.readDataHash(b));
return YES}return NO},didUpdateRecord:function(b,a,c){if(SC.ok(b)){var d=b.get("body");
if(d){d=d.content}a.dataSourceDidComplete(c,d)}else{a.dataSourceDidError(c)}},destroyRecord:function(a,b){return NO
}});sc_require("data_sources/main");FilooFiloo.main=function main(){FilooFiloo.getPath("mainPage.mainPane").append();
var a=FilooFiloo.store.find(FilooFiloo.HIGH_SCORES_QUERY);FilooFiloo.highScoresController.set("content",a)
};function main(){FilooFiloo.main()};