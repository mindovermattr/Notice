import Image from "next/image";
import { DragEvent, HTMLProps, useState } from "react";
import styles from "./KanbanItem.module.scss";

type TKanbanItemProps = HTMLProps<HTMLDivElement> & {
  onDragEnter: (e: DragEvent) => void;
  title: string;
};

const KanbanItem = ({ onDragEnter, title, ...props }: TKanbanItemProps) => {
  const [isDragged, setIsDragged] = useState(false);
  const [isEnter, setIsEnter] = useState(false);
  const [isDropzoneActive, setIsDropzoneActive] = useState(false);

  const onDragStart = (e: DragEvent<HTMLElement>) => {
    if (e.dataTransfer) {
      setIsDragged(true);
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "qwe");
    }
  };

  const handleDragEnter = (e: DragEvent) => {
    //console.log("enter");
    onDragEnter(e);
    setIsEnter(true);
  };

  const onDragLeave = (e: DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;

    e.stopPropagation();
    // console.log("leave", title);
    setIsEnter(false);
  };

  const onDragEnd = () => {
    setIsDropzoneActive(false);
    setIsEnter(false);
    setIsDragged(false);
  };

  const onDragOver = () => {
    setIsDropzoneActive(true);
  };

  return (
    <div
      draggable
      // todo
      onDrop={onDragEnd}
      onDragStart={(e) => onDragStart(e)}
      onDragLeave={(e) => onDragLeave(e)}
      onDragEnter={handleDragEnter}
      onDragEnd={onDragEnd}
    >
      {isEnter && (
        <div
          onDragOver={onDragOver}
          onDragLeave={() => {
            setIsDropzoneActive(false);
          }}
          className={`${styles.dropzone} ${
            isDropzoneActive ? styles["dropzone--active"] : ""
          }`}
        >
          Drop
        </div>
      )}
      <article
        className={`${styles.task} ${isDragged ? styles["task--dragged"] : ""}`}
        {...props}
      >
        <header className={styles.task__header}>
          <p className={styles.task__text}>Space Tasks 2</p>
          <div className={styles.task__avatar}></div>
        </header>
        <h4 className={styles.task__title}>{title}</h4>
        <footer className={styles.task__footer}>
          <p className={styles.task__num}>
            <Image width={16} height={16} src="/icons/list.svg" alt="icon" /> 4
          </p>
          <p className={styles.task__attachments}>2</p>
          <p className={styles.task__period}>6 days left</p>
        </footer>
      </article>
    </div>
  );
};

export default KanbanItem;
