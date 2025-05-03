import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { HTMLProps } from "react";
import Button from "../Button/Button";
import styles from "./Tab.module.scss";
type TTab = HTMLProps<HTMLElement>;

const Tab = ({ className, ...props }: TTab) => {
  const selectedSegment = useSelectedLayoutSegment();

  return (
    <header className={`${styles.tab} ${className}`} {...props}>
      <div className={styles.tab__links}>
        <Link
          href={"Tasklist"}
          className={`${styles.tab__option} ${
            selectedSegment === "Tasklist"
              ? styles["tab__option--selected"]
              : ""
          }`}
        >
          <Image
            width={24}
            height={24}
            src="/icons/list.svg"
            alt="board-icon"
          />
          <p className={styles.tab__text}>Task List</p>
        </Link>
        <Link
          href={"Kanban"}
          className={`${styles.tab__option} ${
            selectedSegment === "Kanban" ? styles["tab__option--selected"] : ""
          }`}
        >
          <Image
            width={24}
            height={24}
            src="/icons/dashboard.svg"
            alt="board-icon"
          />
          <p className={styles.tab__text}>Boards</p>
        </Link>
        <Link href={"Gantt"} className={styles.tab__option}>
          <Image
            width={24}
            height={24}
            src="/icons/gantt.svg"
            alt="board-icon"
          />
          <p className={styles.tab__text}>Gantt</p>
        </Link>
      </div>
     {selectedSegment === "Tasklist" && <Button>Создать</Button>}
    </header>
  );
};

export default Tab;
