/* Start ----------------------------------------------------- models/game.js*/

// ==========================================================================
// PuyoPuyo.Game
// ==========================================================================

require('core');

/** @class

  Currently static class holding constants.

  @extends SC.Record
  @author Philou
  @version 0.1
*/
PuyoPuyo.Game = SC.Record.extend(
/** @scope PuyoPuyo.Game.prototype */ {

}) ;

/**
  Clear state for an empty cell. null value allows to use it in boolean expressions.
*/
PuyoPuyo.Game.Clear = null;//'clear';

/**
  Available colors for the beans.
*/
PuyoPuyo.Game.Red = 'red';
PuyoPuyo.Game.Green = 'green';
PuyoPuyo.Game.Blue = 'blue';
PuyoPuyo.Game.Purple = 'purple';
PuyoPuyo.Game.Yellow = 'yellow';

PuyoPuyo.Game.Colors = [ PuyoPuyo.Game.Red,
			 PuyoPuyo.Game.Green,
			 PuyoPuyo.Game.Blue,
			 PuyoPuyo.Game.Purple,
			 PuyoPuyo.Game.Yellow];

/**
  Association between states and initials.
*/
PuyoPuyo.Game.initialToState = {};
PuyoPuyo.Game.stateToInitial = {};
PuyoPuyo.Game.stateToName = {};

PuyoPuyo.Game.registerStateWithDetails = function(state, initial, name) {
    initial = initial || state[0];

    PuyoPuyo.Game.initialToState[initial] = state;
    PuyoPuyo.Game.stateToInitial[state] = initial;
    PuyoPuyo.Game.stateToName[state] = name;
};

PuyoPuyo.Game.registerState = function(state) {
    PuyoPuyo.Game.registerStateWithDetails(state, state[0], state);
};

PuyoPuyo.Game.registerStateWithDetails(PuyoPuyo.Game.Clear, ' ', 'clear');
PuyoPuyo.Game.Colors.forEach(PuyoPuyo.Game.registerState);


/**
  Real game dimensions of the board.
*/
PuyoPuyo.Game.ColCount = 6;
PuyoPuyo.Game.RowCount = 12;


/* End ------------------------------------------------------- models/game.js*/

