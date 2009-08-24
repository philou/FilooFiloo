// ==========================================================================
// FilooFiloo.Game
// ==========================================================================

require('core');

/** @class

  Currently static class holding constants.

  @extends SC.Record
  @author Philou
  @version 0.1
*/
FilooFiloo.Game = SC.Record.extend(
/** @scope FilooFiloo.Game.prototype */ {

}) ;

/**
  Clear state for an empty cell. null value allows to use it in boolean expressions.
*/
FilooFiloo.Game.Clear = null;//'clear';

/**
  Available colors for the beans.
*/
FilooFiloo.Game.Red = 'red';
FilooFiloo.Game.Green = 'green';
FilooFiloo.Game.Blue = 'blue';
FilooFiloo.Game.Purple = 'purple';
FilooFiloo.Game.Yellow = 'yellow';

FilooFiloo.Game.Colors = [ FilooFiloo.Game.Red,
			 FilooFiloo.Game.Green,
			 FilooFiloo.Game.Blue,
			 FilooFiloo.Game.Purple,
			 FilooFiloo.Game.Yellow];

/**
  Association between states and initials.
*/
FilooFiloo.Game.initialToState = {};
FilooFiloo.Game.stateToInitial = {};
FilooFiloo.Game.stateToName = {};

FilooFiloo.Game.registerStateWithDetails = function(state, initial, name) {
    initial = initial || state[0];

    FilooFiloo.Game.initialToState[initial] = state;
    FilooFiloo.Game.stateToInitial[state] = initial;
    FilooFiloo.Game.stateToName[state] = name;
};

FilooFiloo.Game.registerState = function(state) {
    FilooFiloo.Game.registerStateWithDetails(state, state[0], state);
};

FilooFiloo.Game.registerStateWithDetails(FilooFiloo.Game.Clear, ' ', 'clear');
FilooFiloo.Game.Colors.forEach(FilooFiloo.Game.registerState);


/**
  Real game dimensions of the board.
*/
FilooFiloo.Game.ColCount = 6;
FilooFiloo.Game.RowCount = 12;

/**
  Gameplay parameters
*/
FilooFiloo.Game.StartTickerInterval = 500;
FilooFiloo.Game.LevelAcceleration = 0.9;
FilooFiloo.Game.LevelUpgrade = 30;
FilooFiloo.Game.CascadeScoreMultiplier = 2;