import styles from "./TaskListItem.module.scss";

const TaskListItem = () => {
  return (
    <section className={styles.item}>
      <div className={styles.item__header}>
        <button className={styles.item__button}>&#8593;</button>
        <h3 className={styles.item__title}>Space Tasks 1</h3>
        <p className={styles.item__counter}> 12 Tasks</p>
      </div>
      <div>asd</div>
    </section>
  );
};

export default TaskListItem;
