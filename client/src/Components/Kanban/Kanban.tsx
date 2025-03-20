import { KanbanColumn } from "./Column/KanbanColumn";
import styles from "./Kanban.module.scss";

const Kanban = () => {
  return (
    <div className={styles.kanban}>
      <KanbanColumn />
      <KanbanColumn />
      <KanbanColumn />
      <KanbanColumn />
    </div>
  );
};

export default Kanban;
