import Image from "next/image";
import { HTMLProps } from "react";
import styles from "./Tab.module.scss";

type TTab = HTMLProps<HTMLElement>;

const Tab = ({ className, ...props }: TTab) => {
  
  return (
    <header className={`${styles.tab} ${className}`} {...props}>
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
  );
};

export default Tab;
