import { TTaskGetApi } from "@/@types/TTask";
import Avatar from "@/Components/Avatar/Avatar";
import { useAppSelector } from "@/store/hooks";
import { formatDate } from "@/utils/date.utils";
import Image from "next/image";
import { DragEvent, HTMLProps, useState } from "react";
import styles from "./KanbanItem.module.scss";

type TKanbanItemProps = HTMLProps<HTMLDivElement> & {
  task: TTaskGetApi;
};

const KanbanItem = ({ task, onDragEnd, ...props }: TKanbanItemProps) => {
  const [isDragged, setIsDragged] = useState(false);
  const userStore = useAppSelector((state) => state.user.user);

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

  return (
    <div
      draggable={userStore?.id === task.assign_user.id}
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
            imgSrc={userStore?.avatarUrl}
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
          <p className={styles.task__period}>{formatDate(task.due_date)}</p>
        </footer>
      </article>
    </div>
  );
};

export default KanbanItem;
