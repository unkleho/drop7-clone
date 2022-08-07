import { useStore } from '../shared/store';

export const Drop7Game = () => {
  // const [state, send] = useMachine(drop7Machine);
  // console.log(state.value);
  const { state, send } = useStore();

  return (
    <div className="m-4">
      <p>{state.value?.game ? state.value.game : state.value}</p>
      <p>{state.context.score}</p>
      {state.matches('home') && (
        <button onClick={() => send('NEW_GAME')}>New Game</button>
      )}

      {state.matches('game.waiting-for-user') && (
        <button onClick={() => send({ type: 'SELECT_COLUMN', column: 1 })}>
          Select Column
        </button>
      )}

      {state.matches('game') &&
        state.context.grid.map((row, i) => {
          return (
            <div key={i}>
              {row.map((cell, i) => {
                return (
                  <div key={i} style={{ background: 'red' }}>
                    {cell} x
                  </div>
                );
              })}
            </div>
          );
        })}

      {/* {state.matches('game.waiting-for-user') && (
        <button onClick={() => send({ type: 'SELECT_COLUMN', column: 1 })}>
          Select Column
        </button>
      )} */}
    </div>
  );
};
