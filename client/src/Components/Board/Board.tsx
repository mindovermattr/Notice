"use client";
import clsx from "clsx";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Board.module.scss";

const Board = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className={styles.board}>
      <Sidebar className={clsx(styles.border, styles["border--sidebar"])} />
      <div className={`${styles["board__tasks-wrapper"]} ${styles.border}`}>
        {children}
      </div>
    </section>
  );
};

export default Board;
