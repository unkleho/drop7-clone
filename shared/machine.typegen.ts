// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.after(300)#drop7.game.dropping-disc": {
      type: "xstate.after(300)#drop7.game.dropping-disc";
    };
    "xstate.after(500)#drop7.game.checking-grid": {
      type: "xstate.after(500)#drop7.game.checking-grid";
    };
    "xstate.after(500)#drop7.game.processing-matched-discs": {
      type: "xstate.after(500)#drop7.game.processing-matched-discs";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards:
      | "NO_DISC_MATCHES"
      | "DISC_MATCHES"
      | "GRID_CLEARED"
      | "GRID_OVER"
      | "NO_MOVES_LEFT_IN_LEVEL"
      | "MOVES_LEFT_IN_LEVEL";
    delays: never;
  };
  eventsCausingActions: {
    clearMatchedDiscs: "xstate.after(500)#drop7.game.checking-grid";
    collapseDiscs:
      | "xstate.after(300)#drop7.game.dropping-disc"
      | "xstate.after(500)#drop7.game.processing-matched-discs";
    consoleLogValue: "NEW_GAME";
    dropDisc: "SELECT_COLUMN";
    getRandomDisc: "";
    incrementLevel: "";
    incrementScore: "xstate.after(500)#drop7.game.checking-grid";
    setupGrid: "NEW_GAME";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    DISC_MATCHES: "xstate.after(500)#drop7.game.checking-grid";
    GRID_CLEARED: "xstate.after(500)#drop7.game.checking-grid";
    GRID_OVER: "xstate.after(500)#drop7.game.checking-grid";
    MOVES_LEFT_IN_LEVEL: "";
    NO_DISC_MATCHES: "xstate.after(500)#drop7.game.checking-grid";
    NO_MOVES_LEFT_IN_LEVEL: "";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "game"
    | "game.adding-cleared-bonus"
    | "game.checking-grid"
    | "game.checking-level"
    | "game.dropping-disc"
    | "game.end-game"
    | "game.incrementing-level"
    | "game.processing-matched-discs"
    | "game.setting-up"
    | "game.waiting-for-user"
    | "home"
    | {
        game?:
          | "adding-cleared-bonus"
          | "checking-grid"
          | "checking-level"
          | "dropping-disc"
          | "end-game"
          | "incrementing-level"
          | "processing-matched-discs"
          | "setting-up"
          | "waiting-for-user";
      };
  tags: never;
}
