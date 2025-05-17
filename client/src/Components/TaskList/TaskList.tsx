"use client";
import { taskCreateSchema } from "@/@schemes/task.schema";
import { TTasklist } from "@/@types/TTasklist";
import { createTask } from "@/api/task.api";
import Button from "@/Components/Button/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getTasklistsThunk } from "@/store/slices/tasklists.slice";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";
import TaskListItem from "./Item/TaskListItem";
import styles from "./TaskList.module.scss";

type TTaskListProps = {
  list: TTasklist;
};

const TaskList = ({ list }: TTaskListProps) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const projects = useAppSelector((state) => state.projects);
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskCreateSchema),
  });

  const submitHandler = async (data: z.infer<typeof taskCreateSchema>) => {
    await createTask(list.id, data);
    await dispatch(getTasklistsThunk({ id: +id }));
    setIsModalOpen(false);
  };

  return (
    <>
      <section className={styles.item}>
        <div className={styles.item__header}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={styles.item__button}
          >
            <span
              className={clsx(styles.item__icon, {
                [styles["item__icon--selected"]]: isOpen,
              })}
            >
              &#8593;
            </span>
          </button>
          <h3 className={styles.item__title}>{list.title}</h3>
          <p className={styles.item__counter}>
            Кол-во задач: {list.tasks.length}
          </p>
        </div>
        <div
          className={clsx(styles["list-wrapper"], {
            [styles["list-wrapper--active"]]: isOpen,
          })}
        >
          <article className={`${styles.item__list} ${styles.list}`}>
            <div className={styles.list__header}>
              <p>Статус</p>
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
            onClick={() => setIsModalOpen(true)}
            variant="outlined"
            className={styles.item__add}
          >
            Добавить задачу
          </Button>
        </div>
      </section>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
          <fieldset className={styles.form__fieldset}>
            <Input
              {...register("title")}
              label="Название задачи"
              placeholder="Название"
              error={errors.title?.message}
            />
            <Input
              {...register("dateTime")}
              label="Дата"
              placeholder="ДД.ММ.ГГГГ"
              error={errors.dateTime?.message}
            />
            <Input
              {...register("time")}
              label="Время"
              placeholder="ЧЧ:ММ"
              error={errors.time?.message}
            />
            <Input
              {...register("description")}
              className={styles.form__description}
              label="Описание"
              placeholder="Описание"
              error={errors.description?.message}
              as="textarea"
            />

            <label htmlFor="users">Назначить на выполнение:</label>
            <select
              {...register("userId")}
              className={styles.form__select}
              name="users"
              id="users"
            >
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
