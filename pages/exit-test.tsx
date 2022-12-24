import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useRef } from 'react';
import { useState } from 'react';

export interface Item {
  id: number;
  text: string;
}

export interface BoxProps {
  data: Item;
  order: number;
  onRemove: (item: Item) => void;
}

let id = 3;
export const ParentBox = () => {
  const [items, setItems] = useState<Item[][]>([
    [
      { id: 1, text: 'Test #1' },
      { id: 2, text: 'Test #2' },
    ],
  ]);
  return (
    <motion.div className="parentbox">
      <button
        onClick={() => {
          id++;
          setItems([
            [...items[0], { id: id, text: `Click to delete id ${id}` }],
          ]);
        }}
      >
        Add
      </button>
      <button
        onClick={() => {
          id++;
          setItems([[]]);
        }}
      >
        Remove All
      </button>

      <motion.div className="grid grid-cols-3">
        <AnimatePresence>
          {items.map((row) =>
            row
              .sort((a, b) => a.id - b.id)
              .map((d, i) => (
                <Box
                  // order={items.length - i}
                  order={i}
                  key={d.id}
                  data={d}
                  onRemove={(item) => {
                    // const newList = items.filter((i) => i.id !== item.id);
                    // console.log(newList);
                    // setItems(newList);
                  }}
                />
              ))
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export const Box = (props: BoxProps) => {
  const dynamicDelay = useRef<number>(0.1);
  const variantBox: Variants = {
    initial: {
      opacity: 0,
    },
    hidden: (i) => ({
      opacity: 0,
      top: 200,
      transition: { duration: 0.5, delay: i * dynamicDelay.current },
    }),
    show: { opacity: 1, top: 0, transition: { duration: 1 } },
  };
  return (
    <motion.li
      layout={true}
      className="box"
      custom={props.order}
      variants={variantBox}
      initial={'initial'}
      animate={'show'}
      exit={'hidden'}
      style={{
        gridColumn: props.order + 1,
        gridRow: 1,
      }}
      onClick={() => {
        dynamicDelay.current = 0; // No delay if we click on the box, only delay when remove all
        props.onRemove(props.data);
      }}
    >
      {props.data.text}
    </motion.li>
  );
};

const ExitTestPage = () => {
  return <ParentBox />;
};

export default ExitTestPage;
