"use client";
import { subtaskSchema } from "@/@schemes/subtask.schema";
import { editTaskSchema } from "@/@schemes/task.schema";
import { ERolesBack } from "@/@types/Enums/ERoles";
import { TAtachment } from "@/@types/TAtachment";
import { TCommentFindAll } from "@/@types/TComments";
import { TTaskGetApi } from "@/@types/TTask";
import { createSubTask } from "@/api/subtask.api";
import {
  deleteTask,
  getTask,
  getTaskComments,
  patchTask,
  upploadTaskFiles,
} from "@/api/task.api";
import Avatar from "@/Components/Avatar/Avatar";
import Button from "@/Components/Button/Button";
import Comments from "@/Components/Comments/Comments";
import Date from "@/Components/Date/Date";
import FileUploader from "@/Components/FileUploader/FileUploader";
import Input from "@/Components/Input/Input";
import Modal from "@/Components/Modal/Modal";
import Subtask from "@/Components/Subtask/Subtask";
import { COLUMN_COLORS } from "@/constants/kanban.constans";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addSubTask,
  patchTaskStore,
  removeTask,
} from "@/store/slices/tasklists.slice";
import { formatDate } from "@/utils/date.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosProgressEvent } from "axios";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./page.module.scss";

const COLUMN_COLORS_STYLES = {
  cyan: "body__status--cyan",
  yellow: "body__status--yellow",
  indigo: "body__status--indigo",
  green: "body__status--green",
} as const;

const Page = ({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>;
}) => {
  const { id, taskId } = use(params);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userStore = useAppSelector((state) => state.user);
  const projectStore = useAppSelector(
    (state) => state.projects.selectedProject
  );

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [task, setTask] = useState<TTaskGetApi | null>(null);
  const [comments, setComments] = useState<TCommentFindAll[]>([]);
  const [isRedacting, setIsRedacting] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const taskList = useAppSelector((state) => state.tasklists.tasklists);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editTaskSchema),
  });

  const subtaskForm = useForm({
    resolver: zodResolver(subtaskSchema),
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
    const resp = await patchTask(+taskId, data);
    if (axios.isAxiosError(resp)) return;
    dispatch(patchTaskStore({ listId: task!.task_list.id, task: resp.data }));
  };

  const subtaskSubmitHandler = async (data: z.infer<typeof subtaskSchema>) => {
    const resp = await createSubTask(+taskId, data.title);
    if (axios.isAxiosError(resp)) return;
    dispatch(
      addSubTask({
        listId: task!.task_list.id,
        taskId: task!.id,
        subtask: resp.data,
      })
    );
    setIsSubtaskModalOpen(false);
  };

  const renderSubtasks = (isRedacting: boolean) => {
    const listId = task?.task_list.id;
    const taskId = task?.id;
    if (!listId || !taskId) return;
    const listIndex = taskList.findIndex((el) => el.id === listId);
    if (listIndex === -1) return;
    const taskIndex = taskList[listIndex].tasks.findIndex(
      (el) => el.id === taskId
    );
    if (taskIndex === -1) return;
    return taskList[listIndex].tasks[taskIndex].subtasks.map((el) => (
      <Subtask
        taskId={+taskId}
        subtask={el}
        key={el.id}
        listId={taskList[listIndex].id}
        isRedacting={isRedacting}
      />
    ));
  };

  const deleteHandler = async () => {
    const listId = task!.task_list.id;

    const resp = await deleteTask(+taskId);
    if (axios.isAxiosError(resp)) return;
    dispatch(
      removeTask({
        listId,
        taskId: +taskId,
      })
    );
    router.push(`/Project/${id}/Dashboard/Tasklist`);
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
        <Image width={16} height={16} src={"/icons/arrow.svg"} alt="arrow" />
        <Link
          href={`/Project/${id}/Dashboard/Tasklist`}
          className={styles.breadcrumbs__item}
        >
          {task?.task_list.title}
        </Link>
        <Image width={16} height={16} src={"/icons/arrow.svg"} alt="arrow" />
        <Link href="#" className={styles.breadcrumbs__item}>
          {task?.title}
        </Link>
      </div>
      <div className={styles.body}>
        <div className={styles.body__form}>
          <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
            <div
              className={clsx(
                styles[COLUMN_COLORS_STYLES[COLUMN_COLORS[task?.status]]],
                styles.body__status
              )}
            ></div>
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
              {userStore.role === ERolesBack.ADMIN && (
                <Button
                  onClick={() => setIsRedacting((prev) => !prev)}
                  variant="text"
                  type={isRedacting ? "submit" : "button"}
                  className={styles.form__icon}
                >
                  <Image width={14} height={14} src={"/icons/pen.svg"} alt="" />
                  {isRedacting ? "Изменить" : "Принять"}
                </Button>
              )}
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
            {!isRedacting && (
              <Button
                className={styles["delete-modal__button"]}
                onClick={() => setIsDeleteModalOpen(true)}
                type="button"
              >
                Удалить задачу
              </Button>
            )}
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
          <Date isRedacting={isRedacting} task={task} setTask={setTask} />
          <div className={styles.subtasks}>
            <h3 className={styles.subtasks__title}>Список подзадач</h3>
            <div className={styles.subtasks__items}>
              {renderSubtasks(isRedacting)}
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
        <form
          onSubmit={subtaskForm.handleSubmit(subtaskSubmitHandler)}
          className={styles["subtask-form"]}
        >
          <Input
            {...subtaskForm.register("title")}
            label="Название подзадачи"
            placeholder="Кратко сформулируйте, что нужно сделать"
            error={subtaskForm.formState.errors.title?.message}
          />
          <Button>Добавить</Button>
        </form>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className={styles["delete-modal"]}>
          <h3>
            Вы уверены, что хотите удалить задачу? <br />
            (это действие нельзя будет отменить)
          </h3>
          <div className={styles["delete-modal__controls"]}>
            <Button
              onClick={() => {
                deleteHandler();
                setIsDeleteModalOpen(false);
              }}
              className={styles["delete-modal__button"]}
            >
              Да, удалить задачу
            </Button>
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              variant="outlined"
            >
              Нет
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Page;
