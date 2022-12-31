import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

type Props = {
  isActive?: boolean;
  className?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export const Dialog: React.FC<Props> = ({
  isActive = true,
  className,
  children,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isActive && (
        <>
          <motion.div
            className={['fixed inset-0 bg-black', className || ''].join(' ')}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 0.7,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => onClose()}
          />
          <motion.article className="fixed inset-4 m-auto max-w-lg bg-gradient-to-bl from-cyan-500 via-indigo-700 to-purple-800">
            <motion.div
              className="absolute inset-[1px] overflow-auto bg-slate-950 p-4"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              {children}
            </motion.div>

            <button
              className="absolute right-4 top-1 bg-gradient-to-bl from-cyan-500 to-blue-800 bg-clip-text text-5xl font-light leading-none text-transparent"
              onClick={onClose}
            >
              ×
            </button>

            {/* <IconButton
              name="close"
              showBorder={false}
            /> */}
          </motion.article>
        </>
      )}
    </AnimatePresence>
  );
};
