import { TTaskGetApi } from "@/@types/TTask";
import {
  TColumnColorsValue,
  TColumnStatusValue,
} from "@/constants/kanban.constans";
import Image from "next/image";
import { HTMLProps } from "react";
import KanbanItem from "../Item/KanbanItem";
import styles from "./KanbanColumn.module.scss";

type TKanbanColumn = HTMLProps<HTMLDivElement> & {
  columnColor: TColumnColorsValue;
  title: TColumnStatusValue;
  tasks: TTaskGetApi[] | undefined;
  updateCard: (task: TTaskGetApi, title: TColumnStatusValue) => void;
};

const COLUMN_COLORS_STYLES = {
  cyan: "column__color--cyan",
  yellow: "column__color--yellow",
  indigo: "column__color--indigo",
  green: "column__color--green",
} as const;

export const KanbanColumn = ({
  columnColor,
  title,
  tasks,
  updateCard,
}: TKanbanColumn) => {
  function dragOverHandler(ev: DragEvent) {
    ev.preventDefault();
  }

  async function dropHandler(ev: DragEvent) {
    ev.preventDefault();
    if (ev.dataTransfer) {
      const task = JSON.parse(
        ev.dataTransfer.getData("application/json")
      ) as TTaskGetApi;
      updateCard(task, title);
    }
  }

  return (
    <section className={styles.column}>
      <header className={styles.column__header}>
        <div className={styles.column__info}>
          <div
            className={`${styles.column__color} ${
              styles[COLUMN_COLORS_STYLES[columnColor]]
            }`}
          />
          <h4 className={styles.column__title}>{title}</h4>
          <div className={styles.column__counter}>{tasks?.length}</div>
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
        onDrop={dropHandler}
        onDragOver={(e) => dragOverHandler(e)}
        className={`${styles.column__tasks} ${styles["column__tasks--selected"]}`}
      >
        {!tasks?.length && <div className={`${styles.dropzone}`}>Drop</div>}
        {tasks?.map((el) => (
          <KanbanItem key={el.id} task={el} />
        ))}
      </div>
    </section>
  );
};
