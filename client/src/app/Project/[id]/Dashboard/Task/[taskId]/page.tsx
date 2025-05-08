"use client";
import { TTaskGetApi } from "@/@types/TTask";
import { getTask } from "@/api/task.api";
import Input from "@/Components/Input/Input";
import axios from "axios";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import styles from "./page.module.scss";

const Page = ({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>;
}) => {
  const { id, taskId } = use(params);
  const [task, setTask] = useState<TTaskGetApi | null>(null);

  useEffect(() => {
    const fetchTask = async (taskId: number) => {
      const resp = await getTask(taskId);
      if (axios.isAxiosError(resp)) return;
      setTask(resp.data);
    };
    fetchTask(+taskId);
  }, []);
  return (
    <div>
      <div className={styles.breadcrumbs}>
        <Link href="#" className={styles.breadcrumbs__item}>
          proj
        </Link>
        <span>&gt;</span>
        <Link href="#" className={styles.breadcrumbs__item}>
          tasklist
        </Link>
        <span>&gt;</span>
        <Link href="#" className={styles.breadcrumbs__item}>
          task
        </Link>
      </div>
      <div className={styles.qwe}>
        <div>
          <form>
            <Input label="Имя" />
            <Input label="Имя" />
          </form>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Page;
