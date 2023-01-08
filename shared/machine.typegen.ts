// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    '': { type: '' };
    'xstate.after(1000)#drop7.game.adding-cleared-bonus': {
      type: 'xstate.after(1000)#drop7.game.adding-cleared-bonus';
    };
    'xstate.after(1000)#drop7.game.checking-grid': {
      type: 'xstate.after(1000)#drop7.game.checking-grid';
    };
    'xstate.after(500)#drop7.game.checking-level': {
      type: 'xstate.after(500)#drop7.game.checking-level';
    };
    'xstate.after(500)#drop7.game.setting-up': {
      type: 'xstate.after(500)#drop7.game.setting-up';
    };
    'xstate.after(800)#drop7.game.clearing-matched-discs': {
      type: 'xstate.after(800)#drop7.game.clearing-matched-discs';
    };
    'xstate.init': { type: 'xstate.init' };
    'xstate.stop': { type: 'xstate.stop' };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards:
      | 'CAN_DROP_DISC'
      | 'DISC_MATCHES'
      | 'GRID_CLEARED'
      | 'GRID_FULL'
      | 'GRID_NOT_OVER'
      | 'GRID_OVER'
      | 'MOVES_LEFT_IN_LEVEL'
      | 'NO_DISC_MATCHES'
      | 'NO_MOVES_LEFT_IN_LEVEL';
    services: never;
  };
  eventsCausingActions: {
    addClearedBonus: 'xstate.after(1000)#drop7.game.checking-grid';
    clearMatchedDiscs:
      | 'EXIT'
      | 'xstate.after(800)#drop7.game.clearing-matched-discs'
      | 'xstate.stop';
    collapseDiscs: '' | 'EXIT' | 'xstate.stop';
    consoleLogValue: 'NEW_GAME';
    dropDisc: 'SELECT_COLUMN';
    getRandomDisc:
      | 'xstate.after(500)#drop7.game.checking-level'
      | 'xstate.after(500)#drop7.game.setting-up';
    hoverColumn: 'HOVER_COLUMN';
    incrementLevel: 'xstate.after(500)#drop7.game.checking-level';
    incrementScore: 'xstate.after(800)#drop7.game.clearing-matched-discs';
    setupGame: 'NEW_GAME';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    CAN_DROP_DISC: 'SELECT_COLUMN';
    DISC_MATCHES: 'xstate.after(1000)#drop7.game.checking-grid';
    GRID_CLEARED: 'xstate.after(1000)#drop7.game.checking-grid';
    GRID_FULL: 'xstate.after(500)#drop7.game.checking-level';
    GRID_NOT_OVER: '';
    GRID_OVER: '';
    MOVES_LEFT_IN_LEVEL: 'xstate.after(500)#drop7.game.checking-level';
    NO_DISC_MATCHES: 'xstate.after(1000)#drop7.game.checking-grid';
    NO_MOVES_LEFT_IN_LEVEL: 'xstate.after(500)#drop7.game.checking-level';
  };
  eventsCausingServices: {};
  matchesStates:
    | 'game'
    | 'game.adding-cleared-bonus'
    | 'game.checking-grid'
    | 'game.checking-level'
    | 'game.clearing-matched-discs'
    | 'game.dropping-disc'
    | 'game.end-game'
    | 'game.incrementing-level'
    | 'game.incrementing-score'
    | 'game.setting-up'
    | 'game.waiting-for-user'
    | 'game.waiting-for-user.hovering-column'
    | 'game.waiting-for-user.wait'
    | 'home'
    | {
        game?:
          | 'adding-cleared-bonus'
          | 'checking-grid'
          | 'checking-level'
          | 'clearing-matched-discs'
          | 'dropping-disc'
          | 'end-game'
          | 'incrementing-level'
          | 'incrementing-score'
          | 'setting-up'
          | 'waiting-for-user'
          | { 'waiting-for-user'?: 'hovering-column' | 'wait' };
      };
  tags: never;
}
