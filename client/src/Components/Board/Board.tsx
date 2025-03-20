import Sidebar from "../Sidebar/Sidebar";
import Tab from "../Tab/Tab";
import styles from "./Board.module.scss";

const Board = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className={styles.board}>
      <aside className={`${styles.aside} ${styles.border}`}>sidebar</aside>
      <Sidebar className={styles.border} />
      <div className={`${styles["board__tasks-wrapper"]} ${styles.border}`}>
        <Tab className={styles.board__tab} />
        {children}
      </div>
    </section>
  );
};

export default Board;
