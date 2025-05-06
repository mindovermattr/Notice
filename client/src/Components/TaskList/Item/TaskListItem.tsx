import { TTask } from "@/@types/TTask";
import FlagIcon from "@/Components/Icons/FlagIcon";
import { formatDate } from "@/utils/date.utils";
import styles from "./TaskListItem.module.scss";

type TTaskListItemProps = TTask;

const TaskListItem = ({ title, priority, due_date }: TTaskListItemProps) => {
  const formattedDate = formatDate(due_date);
  return (
    <div className={styles.body}>
      <div className={`${styles.task}`}>
        <input type="checkbox" readOnly={true} disabled />
        <h4 className={styles.task__title}>{title}</h4>
        <p>qwe</p>
        <p className={styles.task__assignee}>{}</p>
        <p className={styles.task__date}>{formattedDate}</p>
        <button>
          <FlagIcon selected={priority} />
        </button>
      </div>
    </div>
  );
};

export default TaskListItem;
