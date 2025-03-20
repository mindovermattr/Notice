import Kanban from "../Kanban/Kanban";
import Sidebar from "../Sidebar/Sidebar";
import Tab from "../Tab/Tab";
import styles from "./Board.module.scss";

const Board = () => {
  return (
    <section className={styles.board}>
      <aside className={`${styles.aside} ${styles.border}`}>sidebar</aside>
      <Sidebar className={styles.border} />
      <div className={`${styles["board__tasks-wrapper"]} ${styles.border}`}>
        <Tab className={styles.board__tab} />
        <Kanban />
      </div>
    </section>
  );
};

export default Board;
