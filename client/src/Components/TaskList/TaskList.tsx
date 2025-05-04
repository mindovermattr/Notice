"use client";
import Button from "@/Components/Button/Button";
import TaskListItem from "./Item/TaskListItem";
import styles from "./TaskList.module.scss";

const TaskList = () => {
  return (
    <>
      <section className={styles.item}>
        <div className={styles.item__header}>
          <button className={styles.item__button}>&#8593;</button>
          <h3 className={styles.item__title}>Space Tasks 1</h3>
          <p className={styles.item__counter}> 12 Tasks</p>
        </div>
        <div className={styles["list-wrapper"]}>
          <article className={`${styles.item__list} ${styles.list}`}>
            <div className={styles.list__header}>
              <button>&#8593;</button>
              <p className={styles.list__title}>Название задачи</p>
              <p>Подзадачи</p>
              <p className={styles.list__assignee}>Назначен</p>
              <p className={styles.list__date}>Сделать до</p>
              <p>Приоритет</p>
            </div>
            <TaskListItem />
          </article>
          <Button variant="outlined" className={styles.item__add}>
            Добавить задачу
          </Button>
        </div>
      </section>
    </>
  );
};

export default TaskList;
