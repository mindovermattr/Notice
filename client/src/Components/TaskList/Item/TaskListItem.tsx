import { TTask } from "@/@types/TTask";
import { patchTask } from "@/api/task.api";
import FlagIcon from "@/Components/Icons/FlagIcon";
import { useAppDispatch } from "@/store/hooks";
import { patchPriority } from "@/store/slices/tasklists.slice";
import { formatDate } from "@/utils/date.utils";
import styles from "./TaskListItem.module.scss";

type TTaskListItemProps = TTask & {
  listId: number;
};

const TaskListItem = ({
  id,
  listId,
  title,
  priority,
  due_date,
}: TTaskListItemProps) => {
  const formattedDate = formatDate(due_date);
  const dispatch = useAppDispatch();

  const togglePriority = async () => {
    await patchTask(id, { priority: !priority });
    dispatch(patchPriority({ id, listId, priority: !priority }));
  };

  return (
    <div className={styles.body}>
      <div className={`${styles.task}`}>
        <input type="checkbox" readOnly={true} disabled />
        <h4 className={styles.task__title}>{title}</h4>
        <p>qwe</p>
        <p className={styles.task__assignee}>{}</p>
        <p className={styles.task__date}>{formattedDate}</p>
        <button onClick={togglePriority}>
          <FlagIcon selected={priority} />
        </button>
      </div>
    </div>
  );
};

export default TaskListItem;
