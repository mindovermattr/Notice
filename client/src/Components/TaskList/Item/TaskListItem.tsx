import { TTask } from "@/@types/TTask";
import { patchTask } from "@/api/task.api";
import FlagIcon from "@/Components/Icons/FlagIcon/FlagIcon";
import { COLUMN_COLORS } from "@/constants/kanban.constans";
import { useAppDispatch } from "@/store/hooks";
import { patchPriority } from "@/store/slices/tasklists.slice";
import { formatDate } from "@/utils/date.utils";
import clsx from "clsx";
import Link from "next/link";
import styles from "./TaskListItem.module.scss";

type TTaskListItemProps = TTask & {
  listId: number;
};

const COLUMN_COLORS_STYLES = {
  cyan: "task__color--cyan",
  yellow: "task__color--yellow",
  indigo: "task__color--indigo",
  green: "task__color--green",
} as const;

const TaskListItem = ({
  id,
  listId,
  title,
  priority,
  due_date,
  assign_user,
  subtasks,
  status,
}: TTaskListItemProps) => {
  const formattedDate = formatDate(due_date);
  const dispatch = useAppDispatch();

  const togglePriority = async () => {
    await patchTask(id, { priority: !priority });
    dispatch(patchPriority({ id, listId, priority: !priority }));
  };

  return (
    <div className={`${styles.task}`}>
      <div
        className={clsx(
          styles.task__color,
          styles[COLUMN_COLORS_STYLES[COLUMN_COLORS[status]]]
        )}
      ></div>
      <Link href={`Task/${id}`} className={styles.task__title}>
        {title}
      </Link>
      <p>{subtasks.length}</p>
      <p className={styles.task__assignee}>
        {assign_user ? assign_user.name : "-"}
      </p>
      <p className={styles.task__date}>{formattedDate}</p>
      <button onClick={togglePriority}>
        <FlagIcon selected={priority} />
      </button>
    </div>
  );
};

export default TaskListItem;
