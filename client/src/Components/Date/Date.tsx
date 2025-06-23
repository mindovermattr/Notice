import { updateTaskSchema } from "@/@schemes/task.schema";
import { TTaskGetApi } from "@/@types/TTask";
import { patchTask } from "@/api/task.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { patchTaskStore } from "@/store/slices/tasklists.slice";
import { formatDate, serverFormatDate } from "@/utils/date.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";
import styles from "./Date.module.scss";

type TProps = {
  isRedacting: boolean;
  task: TTaskGetApi | null;
  setTask: Function;
};

const Date = ({ isRedacting, task, setTask }: TProps) => {
  const { projects, selectedProject } = useAppSelector(
    (state) => state.projects
  );
  const dispatch = useAppDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(updateTaskSchema),
  });

  useEffect(() => {
    reset({
      due_date: serverFormatDate(task?.due_date),
      createdAt: serverFormatDate(task?.createdAt),
    });
  }, [task]);
  const [isOpen, setIsOpen] = useState(false);

  const submitHandler = async (data: z.infer<typeof updateTaskSchema>) => {
    const resp = await patchTask(task!.id, data);
    if (axios.isAxiosError(resp)) return;
    dispatch(patchTaskStore({ task: resp.data, listId: task!.task_list.id }));
    setIsOpen(false);
    setTask({ ...task, ...resp.data });
  };
  return (
    <>
      <ol
        className={clsx(styles.date, {
          [styles["date--redacting"]]: !isRedacting,
        })}
        onClick={() => !isRedacting && setIsOpen(true)}
      >
        <li className={styles.date__item}>
          <p className={styles.date__title}>Создана:</p>
          <p>{task ? formatDate(task?.createdAt) : "Загрузка"}</p>
        </li>
        <li className={styles.date__item}>
          <p className={styles.date__title}>Выполнить до:</p>
          <p>{task ? formatDate(task?.due_date) : "Загрузка"}</p>
        </li>
        <li className={styles.date__item}>
          <p className={styles.date__title}>Назначен:</p>
          <p>{`${task?.assign_user.name} ${task?.assign_user.lastname}`}</p>
        </li>
      </ol>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
          <fieldset className={styles.form__fieldset}>
            <Input
              {...register("createdAt")}
              label="Дата начала"
              placeholder="ДД.ММ.ГГГГ ЧЧ:ММ"
              error={errors.createdAt?.message}
            />

            <Input
              {...register("due_date")}
              label="Дата сдачи"
              placeholder="ДД.ММ.ГГГГ ЧЧ:ММ"
              error={errors.due_date?.message}
            />
            <label htmlFor="users">Назначить на выполнение:</label>
            <select
              {...register("assign_id")}
              className={styles.form__select}
              id="users"
            >
              {selectedProject?.users.map((el) => (
                <option className={styles.form__item} key={el.id} value={el.id}>
                  {el.name} {el.id}
                </option>
              ))}
            </select>
            {errors.assign_id?.message}
            <Button>Изменить</Button>
          </fieldset>
        </form>
      </Modal>
    </>
  );
};

export default Date;
