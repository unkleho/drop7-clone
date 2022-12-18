import { useState } from 'react';
import { Drop7GameGrid } from '../components/drop7-game-grid';
import { GameGrid } from '../shared/drop7';
import { motion } from 'framer-motion';

const GridPage = () => {
  const [gameGrid, setGameGrid] = useState<GameGrid>([
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [
      null,
      null,
      { id: 'disc-3', value: 6, position: [2, 1] },
      null,
      null,
      null,
      null,
    ],
    [
      { id: 'cracked-1', value: 'cracked', position: [0, 1] },
      { id: 'disc-2', value: 3, position: [1, 1] },
      { id: 'disc-4', value: 6, position: [2, 1] },
      null,
      null,
      null,
      null,
    ],
    [
      { id: 'disc-1', value: 3, position: [0, 2] },
      { id: 'blank-1', value: 'blank', position: [1, 2] },
      { id: 'blank-2', value: 'blank', position: [2, 2] },
      null,
      null,
      null,
      null,
    ],
  ]);
  const [items, setItems] = useState(['1', '2', '3', '4']);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
        delayChildren: 0.5,
      },
    },
  };

  const containerItem = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <div className="p-4">
      <motion.button onClick={() => setItems(['2', '3', '1'])}>
        Change
      </motion.button>
      <motion.button onClick={() => setItems(['1', '2', '3', '4'])}>
        Change
      </motion.button>
      <motion.button onClick={() => setItems([])}>Clear</motion.button>

      <motion.div
        // animate={{ transition: { delayChildren: 0.5 } }}
        variants={container}
        className="grid gap-4"
        initial="hidden"
        animate="show"
        exit="hidden"
        // style={{ gridTemplateRows: 'repeat(8, minmax(0, 1fr)' }}
        style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
        {items.map((item, i) => {
          return (
            <motion.div
              layout
              layoutId={item}
              // transition={{ type: 'spring' }}
              key={item}
              variants={containerItem}
              transition={{ delay: i * 0.1 }}
              // initial={{
              //   opacity: 0,
              // }}
              // animate={{
              //   opacity: 1,
              // }}
              className="bg-blue-500 p-4"
            >
              {item}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default GridPage;
