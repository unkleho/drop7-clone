import React from 'react';
import { useStore } from '../shared/store';
import { ActionButton } from './action-button';
import { Dialog } from './dialog';

type Props = {
  status: 'game' | 'home';
  isMenuOpen: boolean;
  onClose: () => void;
  onEndGameClick: () => void;
};

const Drop7Dialog: React.FC<Props> = ({
  status,
  isMenuOpen,
  onClose,
  onEndGameClick,
}) => {
  const { state } = useStore();
  const { context } = state;

  return (
    <Dialog isActive={isMenuOpen} onClose={onClose}>
      {status === 'game' && (
        <>
          <h2 className="mb-4 font-semibold uppercase tracking-widest opacity-80">
            Options
          </h2>
          <ActionButton className="mt-4 mb-8 w-full" onClick={onEndGameClick}>
            End game
          </ActionButton>
        </>
      )}

      <div>
        <div className="flex gap-3">
          <h2 className="mb-4 font-semibold uppercase tracking-widest opacity-80">
            High score:
          </h2>
          <p className="mb-6 opacity-70">{context.highScore}</p>
        </div>

        <p className="mb-6 bg-gradient-to-bl from-cyan-500 to-blue-800 bg-clip-text text-center text-transparent">
          ⦿
        </p>
        <h2 className="mb-4 font-semibold uppercase tracking-widest opacity-80">
          How to play
        </h2>
        <p className="mb-6 text-lg opacity-70">
          Select a column to drop the disc on. Get points by matching the number
          on the disc to the amount of discs in its row or column.
        </p>
        <p className="mb-6 text-lg opacity-70">
          Matching disc(s) will disappear, cracking any adjacent discs without
          numbers.
        </p>

        <p className="mb-6 bg-gradient-to-bl from-cyan-500 to-blue-800 bg-clip-text text-center text-transparent">
          ⦿
        </p>

        <h1 className="mb-4 font-semibold  uppercase tracking-widest opacity-80">
          Info
        </h1>

        <p className="mb-6 text-lg opacity-70">
          Drop 7 is one of my all time favourite mobile puzzle games. For some
          reason, it is no longer available on the App Store.
        </p>
        <p className="text-lg opacity-70">
          What does an intrepid programmer do? Create a web-based clone!
        </p>
      </div>
    </Dialog>
  );
};

export default Drop7Dialog;
