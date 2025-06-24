"use client";
import { TTaskGetApi } from "@/@types/TTask";
import { getTasks, patchTask } from "@/api/task.api";
import {
  COLUMN_COLORS,
  COLUMN_STATUS,
  TColumnStatusValue,
} from "@/constants/kanban.constans";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { patchTaskStore } from "@/store/slices/tasklists.slice";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { KanbanColumn } from "./Column/KanbanColumn";
import styles from "./Kanban.module.scss";

type TTaskGroups = {
  [key in TColumnStatusValue]: TTaskGetApi[];
};

const Kanban = () => {
  const [grouppedTasks, setGrouppedTasks] = useState<TTaskGroups | null>(null);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.user.role);

  useEffect(() => {
    const fetchTasks = async (id: number) => {
      const response = await getTasks(id);
      if (axios.isAxiosError(response)) return;
      const columns = Object.values(COLUMN_STATUS).reduce((acc, status) => {
        acc[status] = [];
        return acc;
      }, {} as TTaskGroups);

      const groups = response.data.tasks.reduce((acc, task) => {
        acc[task.status].push(task);
        return acc;
      }, columns);
      setGrouppedTasks(groups);
    };
    fetchTasks(+id);
  }, []);

  const updateCard = async (task: TTaskGetApi, title: TColumnStatusValue) => {
    if (!grouppedTasks) return;
    const response = await patchTask(task.id, { ...task, status: title, role });
    if (axios.isAxiosError(response)) return;

    const updatedTasks = { ...grouppedTasks };
    updatedTasks[task.status] = updatedTasks[task.status].filter(
      (t) => t.id !== task.id
    );
    updatedTasks[title] = [...updatedTasks[title], { ...task, status: title }];

    setGrouppedTasks(updatedTasks);
    dispatch(
      patchTaskStore({
        listId: response.data.task_list_id,
        task: response.data,
      })
    );
  };

  return (
    <div className={styles.kanban}>
      {Object.values(COLUMN_STATUS).map((el) => (
        <KanbanColumn
          updateCard={updateCard}
          key={el}
          tasks={grouppedTasks?.[el]}
          columnColor={COLUMN_COLORS[el]}
          title={el}
        />
      ))}
    </div>
  );
};

export default Kanban;
