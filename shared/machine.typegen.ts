// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
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
    consoleLogValue: "NEW_GAME";
    dropDisc: "SELECT_COLUMN";
    incrementLevel: "";
    incrementScore: "";
    setupGrid: "NEW_GAME";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    DISC_MATCHES: "";
    GRID_CLEARED: "";
    GRID_OVER: "";
    MOVES_LEFT_IN_LEVEL: "";
    NO_DISC_MATCHES: "";
    NO_MOVES_LEFT_IN_LEVEL: "";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "game"
    | "game.adding-cleared-bonus"
    | "game.checking-grid"
    | "game.checking-level"
    | "game.clearing-matched-discs"
    | "game.collapsing-discs"
    | "game.dropping-disc"
    | "game.end-game"
    | "game.incrementing-level"
    | "game.setting-up"
    | "game.waiting-for-user"
    | "home"
    | {
        game?:
          | "adding-cleared-bonus"
          | "checking-grid"
          | "checking-level"
          | "clearing-matched-discs"
          | "collapsing-discs"
          | "dropping-disc"
          | "end-game"
          | "incrementing-level"
          | "setting-up"
          | "waiting-for-user";
      };
  tags: never;
}
