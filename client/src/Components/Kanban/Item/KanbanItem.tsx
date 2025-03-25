import Image from "next/image";
import styles from "./KanbanItem.module.scss";
const KanbanItem = () => {
  return (
    <article className={styles.task}>
      <header className={styles.task__header}>
        <p className={styles.task__text}>Space Tasks 2</p>
        <div className={styles.task__avatar}></div>
      </header>
      <h4 className={styles.task__title}>Make money online through</h4>
      <footer className={styles.task__footer}>
        <p className={styles.task__num}>
          <Image width={16} height={16} src="/icons/list.svg" alt="icon" /> 4
        </p>
        <p className={styles.task__attachments}>2</p>
        <p className={styles.task__period}>6 days left</p>
      </footer>
    </article>
  );
};

export default KanbanItem;
