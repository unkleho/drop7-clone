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
            transition={{
              type: 'tween',
              duration: 0.2,
              // duration: 1,
            }}
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
          <motion.article
            className="fixed inset-4 m-auto max-w-lg bg-gradient-to-bl from-cyan-500 via-indigo-700 to-purple-800"
            transition={{
              type: 'tween',
              duration: 0.2,
            }}
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
            <motion.div
              className="absolute inset-[1px] overflow-auto bg-slate-950 p-4 pt-4"
              transition={{
                type: 'tween',
                duration: 0.3,
              }}
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
              className="absolute right-0 top-0 bg-gradient-to-bl from-cyan-500 to-blue-800 bg-clip-text pt-1 pr-4 text-5xl font-light leading-none text-transparent"
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
