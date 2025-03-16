import Image from "next/image";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Board.module.scss";

const Board = () => {
  return (
    <section className={styles.board}>
      <aside className={`${styles.aside} ${styles.border}`}>sidebar</aside>
      <Sidebar className={styles.border} />
      <div className={`${styles["board__tasks-wrapper"]} ${styles.border}`}>
        <header className={`${styles.board__tab} ${styles.tab}`}>
          <button className={styles.tab__option}>
            <Image
              width={24}
              height={24}
              src="./icons/dashboard.svg"
              alt="board-icon"
            />
            <p className={styles.tab__text}>Task List</p>
          </button>
          <button
            className={`${styles.tab__option} ${styles["tab__option--selected"]}`}
          >
            <Image
              width={24}
              height={24}
              src="./icons/dashboard.svg"
              alt="board-icon"
            />
            <p className={styles.tab__text}>Boards</p>
          </button>
          <button className={styles.tab__option}>
            <Image
              width={24}
              height={24}
              src="./icons/dashboard.svg"
              alt="board-icon"
            />
            <p className={styles.tab__text}>Gantt</p>
          </button>
        </header>
      </div>
    </section>
  );
};

export default Board;
