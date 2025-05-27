"use client";
import TaskListComponent from "@/Components/TaskList/TaskList";
import { useAppSelector } from "@/store/hooks";

const Tasklist = () => {
  const store = useAppSelector((state) => state.tasklists);
  return (
    <div>
      {!!store.tasklists.length &&
        store.tasklists.map((tasklist) => (
          <TaskListComponent key={tasklist.id} list={tasklist} />
        ))}
    </div>
  );
};

export default Tasklist;
