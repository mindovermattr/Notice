"use client";
import { editTaskSchema } from "@/@schemes/task.schema";
import { TAtachment } from "@/@types/TAtachment";
import { TCommentFindAll } from "@/@types/TComments";
import { TTaskGetApi } from "@/@types/TTask";
import {
  getTask,
  getTaskComments,
  patchTask,
  upploadTaskFiles,
} from "@/api/task.api";
import Avatar from "@/Components/Avatar/Avatar";
import Button from "@/Components/Button/Button";
import Comments from "@/Components/Comments/Comments";
import FileUploader from "@/Components/FileUploader/FileUploader";
import Input from "@/Components/Input/Input";
import Modal from "@/Components/Modal/Modal";
import { useAppSelector } from "@/store/hooks";
import { formatDate } from "@/utils/date.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosProgressEvent } from "axios";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./page.module.scss";

const Page = ({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>;
}) => {
  const { id, taskId } = use(params);
  const userStore = useAppSelector((state) => state.user);
  const projectStore = useAppSelector(
    (state) => state.projects.selectedProject
  );
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [task, setTask] = useState<TTaskGetApi | null>(null);
  const [comments, setComments] = useState<TCommentFindAll[]>([]);
  const [isRedacting, setIsRedacting] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editTaskSchema),
  });

  const handleFileUpload = async (
    formData: FormData,
    onProgress: (progressEvent: AxiosProgressEvent) => void
  ) => {
    setIsUploading(true);
    try {
      await upploadTaskFiles(+taskId, formData, onProgress);
      const task = await getTask(+taskId);
      if (axios.isAxiosError(task)) return;
      setTask(task.data);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (!taskId) return;
    const fetchTask = async (taskId: number) => {
      const task = await getTask(taskId);
      if (axios.isAxiosError(task)) return;
      setTask(task.data);
      reset({
        description: task.data.description,
        title: task.data.title,
      });
      const comments = await getTaskComments(taskId);
      if (axios.isAxiosError(comments)) return;
      setComments(comments.data);
    };
    fetchTask(+taskId);
  }, []);

  const addComment = (comment: TCommentFindAll) => {
    setComments([comment, ...comments]);
  };

  const downloadHandler = async (file: TAtachment) => {
    const r = await axios.get(file.fileUrl, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([r.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = file.fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    console.log(r);
  };

  const submitHandler = async (data: z.infer<typeof editTaskSchema>) => {
    await patchTask(+taskId, data);
  };

  return (
    <div>
      <div className={styles.breadcrumbs}>
        <Link
          href={`/Project/${id}/Dashboard`}
          className={styles.breadcrumbs__item}
        >
          {projectStore?.name}
        </Link>
        <span>&gt;</span>
        <Link
          href={`/Project/${id}/Dashboard/Tasklist`}
          className={styles.breadcrumbs__item}
        >
          {task?.task_list.title}
        </Link>
        <span>&gt;</span>
        <Link href="#" className={styles.breadcrumbs__item}>
          {task?.title}
        </Link>
      </div>
      <div className={styles.body}>
        <div className={styles.body__form}>
          <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
            <div className={styles.form__field}>
              <Input
                {...register("title")}
                className={styles.form__input}
                label="Имя"
                placeholder="Название задачи"
                defaultValue={task?.title}
                disabled={isRedacting}
                error={errors.title?.message}
              />
              <Button
                onClick={() => setIsRedacting((prev) => !prev)}
                variant="text"
                type={isRedacting ? "submit" : "button"}
                className={styles.form__icon}
              >
                <Image width={14} height={14} src={"/icons/pen.svg"} alt="" />
                {isRedacting ? "Изменить" : "Принять"}
              </Button>
            </div>
            <div className={styles.form__field}>
              <Input
                {...register("description")}
                className={styles.form__textarea}
                label="Описание"
                as="textarea"
                placeholder="Описание задачи"
                defaultValue={task?.description}
                disabled={isRedacting}
                error={errors.description?.message}
              />
            </div>
            <Button onClick={() => setIsFileModalOpen(true)} type="button">
              Добавить файлы
            </Button>
            <Button onClick={() => setIsSubtaskModalOpen(true)} type="button">
              Добавить подзадачу
            </Button>
          </form>
          <div className={styles.attachments}>
            <h3 className={styles.attachments__title}>Файлы</h3>
            <div className={styles.attachments__items}>
              {task?.attachments.map((el) => (
                <div className={styles["attachments-wrapper"]} key={el.id}>
                  <div
                    onClick={() => downloadHandler(el)}
                    className={styles.attachments__info}
                  >
                    <Image
                      className={styles.attachments__image}
                      width={80}
                      height={80}
                      src={"/icons/file.svg"}
                      alt="file"
                    />
                    <Avatar
                      className={styles.attachments__avatar}
                      width={48}
                      height={48}
                      imgSrc={el.user?.avatarUrl}
                    />
                  </div>
                  <p className={styles.attachments__name}>{el.fileName}</p>
                  <p className={styles.attachments__date}>
                    {formatDate(el.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
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
          <div className={styles.subtasks}>
            <h3 className={styles.subtasks__title}>Список подзадач</h3>
            <div className={styles.subtasks__items}>
              {task?.subtasks.map((el) => (
                <div key={el.id}>
                  <h4>{el.title}</h4>
                </div>
              ))}
            </div>
          </div>
          <Comments
            taskId={+taskId}
            comments={comments}
            user={userStore?.user}
            addComment={addComment}
          />
        </div>
      </div>
      <Modal isOpen={isFileModalOpen} onClose={() => setIsFileModalOpen(false)}>
        <FileUploader
          onFileUpload={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx"
          multiple={true}
          maxSize={5 * 1024 * 1024} // 5MB
          disabled={isUploading}
        />
      </Modal>
      <Modal
        isOpen={isSubtaskModalOpen}
        onClose={() => setIsSubtaskModalOpen(false)}
      >
        <form action="">
          <Input
            label="Название подзадачи"
            placeholder="Кратко сформулируйте, что нужно сделать"
          />
          <Button>Добавить</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Page;
