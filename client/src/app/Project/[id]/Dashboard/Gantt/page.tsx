"use client";
import { getMonthDate } from "@/utils/date.utils";
import { useState } from "react";
import styles from "./page.module.scss";

const Page = () => {
  const [date, setDate] = useState(new Date());

  const { days, endDate, startDate, weeks } = getMonthDate(date);
  console.log(days, weeks);
  return (
    <article className={styles.gantt}>
      <div className={styles.list}>
        <h3 className={styles.list__title}>Задачи и списки</h3>
        <ul className={styles.list__items}>
          <li className={styles.list__item}>Задача 1</li>
          <li className={styles.list__item}>Задача 1</li>
          <li className={styles.list__item}>Задача 1 lore</li>
        </ul>
      </div>
      <div className={styles.gantt__date}>
        {weeks.map((el, idx) => (
          <p key={idx} className={styles.date__weeks}>
            {el}
          </p>
        ))}
        {days.map((el) => (
          <p className={styles.date__cell}>{+el}</p>
        ))}
        <div>weqqwe</div>
      </div>
    </article>
  );
};

export default Page;
