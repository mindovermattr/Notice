"use client";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Board.module.scss";

const Board = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className={styles.board}>
      {/* <aside className={`${styles.aside} ${styles.border}`}>sidebar</aside> */}
      <Sidebar className={styles.border} />
      <div className={`${styles["board__tasks-wrapper"]} ${styles.border}`}>
       
        {children}
      </div>
    </section>
  );
};

export default Board;
