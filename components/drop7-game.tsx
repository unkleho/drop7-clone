import { motion } from 'framer-motion';
import { useState } from 'react';
import { useKeyPress } from '../shared/hooks/use-key-press';
import { usePrevious } from '../shared/hooks/use-previous';
import { initialMovesPerLevel } from '../shared/machine';
import { useStore } from '../shared/store';
import { ActionButton } from './action-button';
import { Dialog } from './dialog';
import Drop7Dialog from './drop7-dialog';
import { DiscState, Drop7Disc } from './drop7-disc';
import { Drop7GameGrid } from './drop7-game-grid';
import { MenuIcon } from './menu-icon';

export const Drop7Game = () => {
  const { state, send } = useStore();
  const { context } = state;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Find disc in first row. This row is always for the next disc.
  const nextDiscColumn = context.grid[0]?.findIndex((value) => value);

  const movesInLevel = initialMovesPerLevel - context.level + 1;

  useKeyPress('ArrowLeft', [nextDiscColumn], undefined, () => {
    if (nextDiscColumn > 0) {
      send({ type: 'HOVER_COLUMN', column: nextDiscColumn - 1 });
    }
  });

  useKeyPress('ArrowRight', [nextDiscColumn], undefined, () => {
    if (nextDiscColumn < 6) {
      send({ type: 'HOVER_COLUMN', column: nextDiscColumn + 1 });
    }
  });

  useKeyPress('Enter', [nextDiscColumn], undefined, () => {
    send({ type: 'SELECT_COLUMN', column: nextDiscColumn });
  });

  let discState: DiscState;
  if (
    ['game.clearing-matched-discs', 'game.waiting-for-user'].some(state.matches)
  ) {
    discState = 'waiting'; // spring
  } else if (['game.setting-up'].some(state.matches)) {
    // TODO: setting-up state is too short
    discState = 'entering';
  } else {
    discState = 'dropping'; // tween bounce
  }
  console.log(state.value, 'discState', discState);
  // console.log('movesInLevel', movesInLevel);

  return (
    <div className="flex h-full flex-col p-5 sm:p-8">
      <header className="mb-4 flex w-full justify-between">
        <div className="flex flex-1">
          <h1 className="mr-8 flex items-start text-xl font-medium uppercase leading-none tracking-wide opacity-100">
            <span className="opacity-80">Drop</span>
            <span
              className="bg-gradient-to-b from-blue-500 to-blue-800 bg-clip-text leading-none text-transparent"
              style={{
                transform: 'scale(1.4) translateY(-1px)',
                transformOrigin: 'top left',
              }}
            >
              7
            </span>
            <div className="ml-4 h-4 w-1 bg-gradient-to-bl from-cyan-500/80 via-indigo-700/75 to-purple-700/40 pl-[1px] sm:h-4">
              <div className="h-full w-full bg-slate-950"></div>
            </div>
            <p className="mt-[1px] pl-2 text-sm font-light leading-none tracking-wider opacity-80">
              Clone
            </p>
          </h1>
        </div>

        <div className="ml-auto flex">
          <button
            className="align-center -mt-5 -mr-4 flex pt-4 pr-4 text-sm font-light uppercase leading-none tracking-wider opacity-100"
            onClick={() => setIsMenuOpen(true)}
          >
            {/* <span className="bg-gradient-to-bl from-cyan-500 to-blue-800 bg-clip-text font-light leading-none text-transparent">
              {'◀ '}
            </span> */}

            <MenuIcon className="mr-3 mt-[2px]" />

            <span className="opacity-80">Menu</span>
          </button>

          {/* <Icon name="menu" /> */}
        </div>
      </header>

      <div className="mx-auto w-full max-w-md">
        {/* Score */}
        <div className="mb-3 flex justify-between">
          <motion.div
            className="flex-1 text-right"
            variants={{
              hidden: {
                opacity: 0,
              },
              visible: {
                opacity: 1,
              },
            }}
            animate={state.matches('game') ? 'visible' : 'hidden'}
          >
            <p className="-mr-1 text-5xl font-light tabular-nums opacity-70 sm:mb-4">
              {context.score.toLocaleString()}
            </p>
          </motion.div>
        </div>

        <Drop7GameGrid
          grid={context.grid}
          discMap={context.discMap}
          discState={discState}
          nextLevelDiscIds={context.nextLevelDiscIds}
          send={send}
        >
          {['home', 'game.end-game'].some(state.matches) && (
            <ActionButton
              className="absolute"
              style={{
                left: '50%',
                top: '56%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 40px 5px #000',
              }}
              onClick={() => {
                if (state.matches('game.end-game')) {
                  send('EXIT');
                }

                send('NEW_GAME');
              }}
            >
              {state.matches('game.end-game') ? 'Play again' : 'New Game'}
            </ActionButton>
          )}

          {['game.clearing-matched-discs', 'game.adding-cleared-bonus'].some(
            state.matches
          ) &&
            context.currentChain > 0 && (
              <div className="relative col-span-7 col-start-1 row-start-1 flex items-center text-sm tracking-widest">
                <p className="uppercase opacity-80">
                  {state.matches('game.clearing-matched-discs') && (
                    <>Chain x {context.currentChain + 1}</>
                  )}

                  {state.matches('game.adding-cleared-bonus') && (
                    <>
                      All clear! <strong>+70,000</strong>
                    </>
                  )}
                </p>
              </div>
            )}
        </Drop7GameGrid>

        {/* Moves per level */}
        {state.matches('game') && (
          <div className="mt-4">
            <div
              className="mb-2 grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${initialMovesPerLevel}, 1fr)`,
              }}
            >
              {[...new Array(movesInLevel < 1 ? 1 : movesInLevel)].map(
                (_, i) => {
                  return (
                    <div
                      className={[
                        'aspect-square w-full rounded-full',
                        context.moves > i
                          ? 'bg-gradient-to-bl from-slate-600 to-slate-800'
                          : 'border border-slate-600',
                      ].join(' ')}
                      key={i}
                    ></div>
                  );
                }
              )}
            </div>
            <p className="text-sm uppercase tracking-wider opacity-50">
              Level {context.level}
            </p>
          </div>
        )}
      </div>

      <footer className="relative mt-auto flex items-end sm:p-2">
        <div className="absolute left-0 bottom-0 h-4 w-4 bg-gradient-to-bl from-cyan-500 via-indigo-700 to-purple-800 pl-[1px] pb-[1px]">
          <div className="h-full w-full bg-slate-950"></div>
        </div>
        <div className="absolute right-0 bottom-0 hidden h-12 w-4 bg-gradient-to-bl from-cyan-800/80 via-indigo-700/75 to-purple-800/60 pr-[1px] pb-[1px]">
          <div className="h-full w-full bg-slate-950"></div>
        </div>
        <p className="relative ml-auto text-sm uppercase">
          <a
            href="https://twitter.com/unkleho"
            className="bg-gradient-to-bl from-cyan-500 to-purple-800 bg-clip-text leading-none tracking-wider text-transparent"
          >
            @unkleho
          </a>
        </p>
      </footer>

      <Drop7Dialog
        status={state.matches('game') ? 'game' : 'home'}
        isMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onEndGameClick={() => {
          send('EXIT');
          setIsMenuOpen(false);
        }}
      />
    </div>
  );
};
