"use client";
import { TCommentFindAll } from "@/@types/TComments";
import { TTaskGetApi } from "@/@types/TTask";
import { getTask, getTaskComments } from "@/api/task.api";
import Button from "@/Components/Button/Button";
import Comments from "@/Components/Comments/Comments";
import Input from "@/Components/Input/Input";
import { useAppSelector } from "@/store/hooks";
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
  const userStore = useAppSelector((state) => state.user);
  const [task, setTask] = useState<TTaskGetApi | null>(null);
  const [comments, setComments] = useState<TCommentFindAll[]>([]);
  const [isRedacting, setIsRedacting] = useState(true);

  useEffect(() => {
    const fetchTask = async (taskId: number) => {
      const task = await getTask(taskId);
      if (axios.isAxiosError(task)) return;
      setTask(task.data);
      const comments = await getTaskComments(taskId);
      if (axios.isAxiosError(comments)) return;
      setComments(comments.data);
      // const r = await instance.get("/yandex-disk/file/Горы.jpg", {
      //   responseType: "blob",
      // });
      // const url = window.URL.createObjectURL(new Blob([r.data]));
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "image.jpg";
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);
      // console.log(r);
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
              <p className={styles.date__title}>Назначен:</p>
              <p>{`${task?.assign_user.name} ${task?.assign_user.lastname}`}</p>
            </li>
          </ol>
          <Comments comments={comments} user={userStore.user!} />
        </div>
      </div>
    </div>
  );
};

export default Page;
