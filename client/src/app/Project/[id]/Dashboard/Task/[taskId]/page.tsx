"use client";
import { TCommentFindAll } from "@/@types/TComments";
import { TTaskGetApi } from "@/@types/TTask";
import { getTask, getTaskComments, upploadTaskFiles } from "@/api/task.api";
import Button from "@/Components/Button/Button";
import Comments from "@/Components/Comments/Comments";
import FileUploader from "@/Components/FileUploader/FileUploader";
import Input from "@/Components/Input/Input";
import Modal from "@/Components/Modal/Modal";
import { useAppSelector } from "@/store/hooks";
import { formatDate } from "@/utils/date.utils";
import axios, { AxiosProgressEvent } from "axios";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [task, setTask] = useState<TTaskGetApi | null>(null);
  const [comments, setComments] = useState<TCommentFindAll[]>([]);
  const [isRedacting, setIsRedacting] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (
    formData: FormData,
    onProgress: (progressEvent: AxiosProgressEvent) => void
  ) => {
    setIsUploading(true);
    try {
      const resp = await upploadTaskFiles(+taskId, formData, onProgress);

      console.log(resp.data);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchTask = async (taskId: number) => {
      const task = await getTask(taskId);
      if (axios.isAxiosError(task)) return;
      console.log(task.data);
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

  const addComment = (comment: TCommentFindAll) => {
    setComments([comment, ...comments]);
  };
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
            <Button onClick={() => setIsModalOpen(true)} type="button">
              Добавить файлы
            </Button>
            <Button type="button">Добавить подзадачу</Button>
          </form>
        </div>
        <div className={styles.body__info}>
          <ol className={styles.date}>
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
          <Comments
            taskId={+taskId}
            comments={comments}
            user={userStore?.user}
            addComment={addComment}
          />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FileUploader
          onFileUpload={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx"
          multiple={true}
          maxSize={5 * 1024 * 1024} // 5MB
          disabled={isUploading}
        />
      </Modal>
    </div>
  );
};

export default Page;
