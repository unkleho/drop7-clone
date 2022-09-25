import type { NextPage } from 'next';
import { Drop7Game } from '../components/drop7-game';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Drop7Game />
    </div>
  );
};

export default Home;
