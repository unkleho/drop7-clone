import { useStore } from '../shared/store';

export const Drop7Game = () => {
  // const [state, send] = useMachine(drop7Machine);
  // console.log(state.value);
  const { state, send } = useStore();

  return (
    <div className="my-4">
      <p>{state.value?.game ? state.value.game : state.value}</p>
      <p>{state.context.score}</p>
      {state.matches('home') && (
        <button onClick={() => send('NEW_GAME')}>New Game</button>
      )}

      {state.matches('game.waiting-for-user') &&
        state.context.grid[0].map((_, column) => {
          return (
            <button
              className="w-4"
              onClick={() => send({ type: 'SELECT_COLUMN', column })}
              key={column}
            >
              {column}
            </button>
          );
        })}

      {state.matches('game') && (
        <div>
          {state.context.grid.map((row, i) => {
            return (
              <div className="flex" key={i}>
                {row.map((cell, i) => {
                  return (
                    <div className="w-16" key={i}>
                      {cell ? state.context.discMap[cell] : 'x'}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* {state.matches('game.waiting-for-user') && (
        <button onClick={() => send({ type: 'SELECT_COLUMN', column: 1 })}>
          Select Column
        </button>
      )} */}
    </div>
  );
};
