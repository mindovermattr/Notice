"use client";
import { KanbanColumn } from "./Column/KanbanColumn";
import styles from "./Kanban.module.scss";

const Kanban = () => {
  return (
    <div className={styles.kanban}>
      <KanbanColumn title="To do" columnColor="cyan" />
      <KanbanColumn title="In Work" columnColor="yellow" />
      <KanbanColumn title="Review" columnColor="indigo" />
      <KanbanColumn title="Done" columnColor="green" />
    </div>
  );
};

export default Kanban;
