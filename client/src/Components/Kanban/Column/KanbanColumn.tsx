import KanbanItem from "../Item/KanbanItem";
import styles from "./KanbanColumn.module.scss";

export const KanbanColumn = () => {
  return (
    <section className={styles.column}>
      <header className={styles.column__header}>
        <div className={styles.column__info}>
          <div className={styles.column__color} />
          <h4 className={styles.column__title}>To do</h4>
          <div className={styles.column__counter}>5</div>
        </div>
        <div>
          <button>b1</button>
          <button>b2</button>
        </div>
      </header>

      <div className={styles.column__tasks}>
        <KanbanItem />
        <KanbanItem />
        <KanbanItem />
      </div>
    </section>
  );
};
