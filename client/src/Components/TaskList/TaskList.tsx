"use client";
import { TTasklist } from "@/@types/TTasklist";
import { createTask } from "@/api/task.api";
import Button from "@/Components/Button/Button";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";
import TaskListItem from "./Item/TaskListItem";
import styles from "./TaskList.module.scss";

type TTaskListProps = {
  list: TTasklist;
};

const TaskList = ({ list }: TTaskListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const projects = useAppSelector((state) => state.projects);

  const handleCreateTask = async () => {
    await createTask();
  };
  return (
    <>
      <section className={styles.item}>
        <div className={styles.item__header}>
          <button className={styles.item__button}>&#8593;</button>
          <h3 className={styles.item__title}>{list.title}</h3>
          <p className={styles.item__counter}>
            Кол-во задач: {list.tasks.length}
          </p>
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
            {!!list.tasks.length &&
              list.tasks.map((task) => (
                <TaskListItem key={task.id} {...task} listId={list.id} />
              ))}
          </article>
          <Button
            onClick={() => setIsOpen(true)}
            variant="outlined"
            className={styles.item__add}
          >
            Добавить задачу
          </Button>
        </div>
      </section>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form className={styles.form}>
          <fieldset className={styles.form__fieldset}>
            <Input label="Название задачи" placeholder="Название" />
            <Input label="Дата" placeholder="ДД:ММ:ГГГГ" />
            <Input label="Время" placeholder="ЧЧ:ММ" />
            <label htmlFor="users">Назначить на выполнение:</label>
            <select className={styles.form__select} name="users" id="users">
              {projects.selectedProject?.users.map((el) => (
                <option className={styles.form__item} key={el.id} value={el.id}>
                  {el.name}
                </option>
              ))}
            </select>
            <Button>Добавить</Button>
          </fieldset>
        </form>
      </Modal>
    </>
  );
};

export default TaskList;
