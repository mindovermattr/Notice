import Image from "next/image";
import { HTMLProps } from "react";
import KanbanItem from "../Item/KanbanItem";
import styles from "./KanbanColumn.module.scss";

const COLUMN_COLORS = {
  cyan: "column__color--cyan",
  yellow: "column__color--yellow",
  indigo: "column__color--indigo",
  green: "column__color--green",
} as const;

type TKanbanColumn = HTMLProps<HTMLDivElement> & {
  columnColor: keyof typeof COLUMN_COLORS;
  title: string;
};

export const KanbanColumn = ({ columnColor, title }: TKanbanColumn) => {
  function dragoverHandler(ev: DragEvent) {
    ev.preventDefault();
    if (ev.dataTransfer) {
    }
  }
  function dropHandler(ev: DragEvent) {
    ev.preventDefault();
    if (ev.dataTransfer) {
      const data = ev.dataTransfer.getData("text/plain");

      console.log(data);
    }
  }

  return (
    <section className={styles.column}>
      <header className={styles.column__header}>
        <div className={styles.column__info}>
          <div
            className={`${styles.column__color} ${
              styles[COLUMN_COLORS[columnColor]]
            }`}
          />
          <h4 className={styles.column__title}>{title}</h4>
          <div className={styles.column__counter}>5</div>
        </div>
        <div>
          <button>
            <Image
              width={24}
              height={3}
              src={"/icons/more.svg"}
              alt="more icon"
            />
          </button>
        </div>
      </header>

      <div
        // onDragEnter={() => console.log(title)}
        onDrop={(event) => dropHandler(event)}
        onDragOver={(event) => dragoverHandler(event)}
        className={`${styles.column__tasks} ${styles["column__tasks--selected"]}`}
      >
        <KanbanItem title="title 1" onDragEnter={() => ""} />
        <KanbanItem title="title 2" onDragEnter={() => ""} />
        <KanbanItem title="title 3" onDragEnter={() => ""} />
      </div>
    </section>
  );
};
