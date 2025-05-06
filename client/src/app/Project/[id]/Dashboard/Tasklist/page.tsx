"use client";
import TaskListComponent from "@/Components/TaskList/TaskList";
import { useAppSelector } from "@/store/hooks";

const Tasklist = () => {
  const store = useAppSelector((state) => state.tasklists);
  return (
    !!store.tasklists.length &&
    store.tasklists.map((tasklist) => (
      <TaskListComponent key={tasklist.id} list={tasklist} />
    ))
  );
};

export default Tasklist;
