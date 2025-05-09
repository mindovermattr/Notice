"use client";
import { TTaskGetApi } from "@/@types/TTask";
import { getTask } from "@/api/task.api";
import Button from "@/Components/Button/Button";
import Input from "@/Components/Input/Input";
import { formatDate } from "@/utils/date.utils";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import styles from "./page.module.scss";

const Page = ({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>;
}) => {
  const { id, taskId } = use(params);
  const [task, setTask] = useState<TTaskGetApi | null>(null);
  const [isRedacting, setIsRedacting] = useState(true);

  useEffect(() => {
    const fetchTask = async (taskId: number) => {
      const resp = await getTask(taskId);
      if (axios.isAxiosError(resp)) return;
      setTask(resp.data);
    };
    fetchTask(+taskId);
  }, []);
  return (
    <div>
      <div className={styles.breadcrumbs}>
        <Link href="#" className={styles.breadcrumbs__item}>
          proj
        </Link>
        <span>&gt;</span>
        <Link href="#" className={styles.breadcrumbs__item}>
          tasklist
        </Link>
        <span>&gt;</span>
        <Link href="#" className={styles.breadcrumbs__item}>
          task
        </Link>
      </div>
      <div className={styles.body}>
        <div className={styles.body__form}>
          <form className={styles.form}>
            <div className={styles.form__field}>
              <Input
                className={styles.form__input}
                label="Имя"
                placeholder="Название задачи"
                disabled={isRedacting}
              />
              <Button
                onClick={() => setIsRedacting((prev) => !prev)}
                variant="text"
                type="button"
                className={styles.form__icon}
              >
                <Image width={14} height={14} src={"/icons/pen.svg"} alt="" />
                {isRedacting ? "Изменить" : "Отменить"}
              </Button>
            </div>
            <div className={styles.form__field}>
              <Input
                className={styles.form__textarea}
                label="Описание"
                as="textarea"
                placeholder="Описание задачи"
                disabled={isRedacting}
              />
            </div>
            <Button type="button">Добавить подзадачу</Button>
            <Button type="button">Добавить подзадачу</Button>
          </form>
        </div>
        <div className={styles.body__info}>
          <ol className={styles.date}>
            <li className={styles.date__item}>
              <p className={styles.date__title}>Создана:</p>
              <p>{formatDate(task?.createdAt)}</p>
            </li>
            <li className={styles.date__item}>
              <p className={styles.date__title}>Выполнить до:</p>
              <p>{formatDate(task?.due_date)}</p>
            </li>
            <li className={styles.date__item}>
              <p className={styles.date__title}>Назначен на выполнение:</p>
              <p>{`${task?.assign_user.name} ${task?.assign_user.lastname}`}</p>
            </li>
          </ol>
          <div>
            <h3>Обсуждение</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
