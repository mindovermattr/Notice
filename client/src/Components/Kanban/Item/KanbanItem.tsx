import { ERolesBack } from "@/@types/Enums/ERoles";
import { TTaskGetApi } from "@/@types/TTask";
import Avatar from "@/Components/Avatar/Avatar";
import { useAppSelector } from "@/store/hooks";
import { formatDate } from "@/utils/date.utils";
import clsx from "clsx";
import Image from "next/image";
import { DragEvent, HTMLProps, useState } from "react";
import styles from "./KanbanItem.module.scss";

type TKanbanItemProps = HTMLProps<HTMLDivElement> & {
  task: TTaskGetApi;
};

const KanbanItem = ({ task, onDragEnd, ...props }: TKanbanItemProps) => {
  const [isDragged, setIsDragged] = useState(false);
  const { user, role } = useAppSelector((state) => state.user);

  const onDragStart = (e: DragEvent<HTMLElement>) => {
    if (e.dataTransfer) {
      setIsDragged(true);
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("application/json", JSON.stringify({ ...task }));
    }
  };

  const onDragLeave = (e: DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    e.stopPropagation();
  };

  const onDragEndHandler = (ev: DragEvent) => {
    setIsDragged(false);
  };

  const isDraggble =
    role === ERolesBack.ADMIN ||
    (user?.id === task.assign_user.id &&
      task.status !== "Review" &&
      task.status !== "Done");

  const dateCheck = (date: string) => {
    const dateToCheck = new Date(date);

    const today = new Date();

    const dateAfterWeek = new Date();
    dateAfterWeek.setDate(today.getDate() + 7);

    const checkDateOnly = new Date(
      dateToCheck.getFullYear(),
      dateToCheck.getMonth(),
      dateToCheck.getDate()
    );
    const afterWeekDateOnly = new Date(
      dateAfterWeek.getFullYear(),
      dateAfterWeek.getMonth(),
      dateAfterWeek.getDate()
    );
    return checkDateOnly < afterWeekDateOnly;
  };

  return (
    <div
      draggable={isDraggble}
      onDrop={onDragEndHandler}
      onDragStart={(e) => onDragStart(e)}
      onDragLeave={(e) => onDragLeave(e)}
      onDragEnd={onDragEndHandler}
    >
      <article
        className={`${styles.task} ${isDragged ? styles["task--dragged"] : ""}`}
        {...props}
      >
        <header className={styles.task__header}>
          <p className={styles.task__text}>{task.task_list.title}</p>
          <Avatar
            width={24}
            height={24}
            imgSrc={user?.avatarUrl}
            className={styles.task__avatar}
          />
        </header>
        <h4 className={styles.task__title}>{task.title}</h4>
        <footer className={styles.task__footer}>
          <p className={styles.task__num}>
            <Image width={16} height={16} src="/icons/list.svg" alt="icon" />{" "}
            <span>{task.subtasks.length}</span>
          </p>
          <p className={styles.task__attachments}>
            <Image
              width={16}
              height={16}
              src="/icons/fileClip.svg"
              alt="icon"
            />
            {task.attachments.length}
          </p>
          <p
            className={clsx(styles.task__period, {
              [styles.red]: dateCheck(task.due_date),
            })}
          >
            {formatDate(task.due_date)}
          </p>
        </footer>
      </article>
    </div>
  );
};

export default KanbanItem;
