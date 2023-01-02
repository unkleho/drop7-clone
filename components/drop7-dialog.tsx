import React from 'react';
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
  return (
    <Dialog isActive={isMenuOpen} onClose={onClose}>
      {status === 'game' && (
        <ActionButton className="mb-8 w-full" onClick={onEndGameClick}>
          End game
        </ActionButton>
      )}

      <div>
        <h2 className="mb-4 font-semibold uppercase tracking-widest opacity-80">
          How to play
        </h2>
        <p className="mb-6 text-lg opacity-70">
          Select a column to drop the disc on. Get points by matching the number
          on the disc to the amount of discs in its row or column.
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
