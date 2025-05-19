"use client";
import { getMonthDate } from "@/utils/date.utils";
import clsx from "clsx";
import { useState } from "react";
import styles from "./page.module.scss";

const Page = () => {
  const [date, setDate] = useState(new Date());

  const { days, endDate, startDate, weeks } = getMonthDate(date);
  return (
    <article className={styles.gantt}>
      <div className={clsx(styles.gantt__list, styles.list)}>
        <h3 className={styles.list__title}>Задачи и списки</h3>
        <ul className={styles.list__items}>
          <li className={styles.list__item}>Задача 1</li>
          <li>Задача 1</li>
          <li>Задача 1</li>
          <li>Задача 1</li>
        </ul>
      </div>
      <div>вик</div>
    </article>
  );
};

export default Page;
