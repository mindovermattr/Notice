"use client";
import { TTask } from "@/@types/TTask";
import { getTasks } from "@/api/task.api";
import Avatar from "@/Components/Avatar/Avatar";
import { COLUMN_STATUS } from "@/constants/kanban.constans";
import { getMonthDate } from "@/utils/date.utils";
import axios from "axios";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

const COLUMN_COLORS_STYLES = {
  [COLUMN_STATUS.TODO]: "task--cyan",
  [COLUMN_STATUS.INWORK]: "task--yellow",
  [COLUMN_STATUS.REVIEW]: "task--indigo",
  [COLUMN_STATUS.DONE]: "task--green",
} as const;

const Page = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState<TTask[]>([]);
  const { id } = useParams<{ id: string }>();

  const { days, weeks, endDate, startDate } = getMonthDate(date);
  useEffect(() => {
    const fetchTasks = async (id: number) => {
      const response = await getTasks(id);
      if (axios.isAxiosError(response)) return;
      setTasks(response.data.tasks);
    };
    fetchTasks(+id);
  }, []);
  const display = tasks.map((el) => {
    const dueDate = new Date(el.due_date);
    let isInRange = true;

    const createdDate = new Date(el.createdAt);
    let diffInDays = Math.ceil((dueDate - createdDate) / (1000 * 60 * 60 * 24));
    const createdDateUTC = new Date(
      createdDate.getFullYear(),
      createdDate.getMonth(),
      createdDate.getDate()
    );
    let startIndex;
    if (createdDate < startDate) {
      startIndex = 1;
      isInRange = false;
    } else {
      startIndex =
        days.findIndex((el) => {
          return (
            el.getDate() === createdDateUTC.getDate() &&
            el.getMonth() === createdDateUTC.getMonth()
          );
        }) + 1;
    }
    if (diffInDays >= 28)
      return {
        ...el,
        diffInDays: 28,
        startDate: startDate,
        startIndex: startIndex,
        isInRange,
      };

    return {
      ...el,
      diffInDays: diffInDays,
      startDate: createdDateUTC,
      startIndex,
      isInRange,
    };
  });

  return (
    <article className={styles.gantt}>
      <div className={styles.list}>
        <h3 className={styles.list__title}>Задачи и списки</h3>
        <ul className={styles.list__items}>
          {tasks.map((el) => (
            <li key={el.id} className={styles.list__item}>
              {el.title}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.gantt__date}>
        {weeks.map((el, idx) => (
          <p key={idx} className={styles.date__weeks}>
            {el}
          </p>
        ))}
        {days.map((el) => (
          <p key={+el.getDate()} className={styles.date__cell}>
            {+el.getDate()}
          </p>
        ))}
        <div className={styles["task-wrapper"]}>
          {display.map((el, idx) => (
            <Link
              href={`Task/${el.id}`}
              key={el.id}
              className={clsx(
                styles.gantt__task,
                styles[COLUMN_COLORS_STYLES[el.status]],
                styles.task,
                {
                  [styles.noB]: !el.isInRange,
                }
              )}
              style={{
                gridRow: idx + 1,
                gridColumn: `${el.startIndex} / span ${Math.abs(
                  el.diffInDays
                )}`,
              }}
            >
              <Avatar
                imgSrc={el.assign_user?.avatarUrl}
                width={16}
                height={16}
              />
              {el.title}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
};

export default Page;
