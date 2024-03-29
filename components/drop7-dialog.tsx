import React from 'react';
import { DiscValue } from '../shared/drop7';
import { useStore } from '../shared/store';
import { ActionButton } from './action-button';
import { Dialog } from './dialog';
import { Drop7Disc } from './drop7-disc';

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
          <h2 className="mt-2 mb-1 font-semibold uppercase tracking-widest opacity-80">
            Options
          </h2>
          <ActionButton className="mt-4 mb-3 w-full" onClick={onEndGameClick}>
            End game
          </ActionButton>
        </>
      )}

      <div>
        <div className="mt-4 gap-3 text-center">
          <h2 className="mb-2 text-sm uppercase tracking-widest opacity-80">
            High score
          </h2>
          <p className="mb-8 text-4xl font-extralight tracking-widest opacity-70">
            {context.highScore.toLocaleString()}
          </p>
        </div>

        <div className="mb-6 h-[1px] bg-gradient-to-bl from-purple-500 to-blue-800"></div>
        <h2 className="mb-4 font-semibold uppercase tracking-widest opacity-80">
          How to play
        </h2>
        <p className="mb-6 text-lg opacity-70">
          Select a column to drop the disc on. Get points by matching the number
          on the disc to the amount of discs in its row or column.
        </p>
        <p className="mb-6 text-lg opacity-70">
          Matching disc(s) will disappear, <q>cracking</q> any adjacent discs
          without numbers like the one below.
        </p>

        <Drop7Disc value={'blank'} className="m-auto mb-6 w-12" />

        <p className="mb-6 text-lg opacity-70">
          After cracking once, you&apos;ll have to crack it again:
        </p>

        <Drop7Disc value={'cracked'} className="m-auto mb-6 w-12" />

        <p className="mb-6 text-lg opacity-70">
          One more crack and it will reveal a number. eg.
        </p>

        <Drop7Disc
          value={Math.ceil(Math.random() * 7) as DiscValue}
          className="m-auto mb-6 w-12"
        />

        <p className="mb-6 text-lg opacity-70">
          If you are clever and manage to clear the whole board of discs, you
          will get a bonus <strong>70,000</strong> points!
        </p>

        <div className="mb-6 h-[1px] bg-gradient-to-bl from-purple-500 to-blue-800"></div>

        <h1 className="mb-4 font-semibold  uppercase tracking-widest opacity-80">
          Info
        </h1>

        <p className="mb-6 text-lg opacity-70">
          Drop 7 is one of my all time favourite mobile puzzle games. I&apos;ve
          been wanting to play it lately, but for some reason, it is no longer
          available on the App Store.
        </p>

        <p className="mb-6 text-lg opacity-70">
          What does a desparate programmer do? Create a web-based clone!
        </p>

        <p className="text-lg opacity-70">This game is built with:</p>

        <ul className="mb-6 list-disc pl-5 text-lg opacity-70">
          <li>
            <a className="link" href="https://reactjs.org/">
              React
            </a>
          </li>
          <li>
            <a className="link" href="https://nextjs.org/">
              Next JS
            </a>
          </li>
          <li>
            <a className="link" href="https://xstate.js.org/">
              XState
            </a>
          </li>
          <li>
            <a className="link" href="https://www.framer.com/motion/">
              Framer Motion
            </a>
          </li>
          <li>
            <a className="link" href="https://tailwindcss.com/">
              Tailwind CSS
            </a>
          </li>
        </ul>

        <p className="mb-6 text-lg opacity-70">
          Open sourced repo here:
          <br />{' '}
          <a className="link" href="https://github.com/unkleho/drop7-clone">
            github.com/unkleho/drop7-clone
          </a>
        </p>

        <p className="text-lg opacity-70">
          By{' '}
          <a className="link" href="https://twitter.com/unkleho">
            @unkleho
          </a>
        </p>
      </div>
    </Dialog>
  );
};

export default Drop7Dialog;
