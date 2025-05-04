import FlagIcon from "@/Components/Icons/FlagIcon";
import styles from "./TaskListItem.module.scss";

const TaskListItem = () => {
  return (
    <div className={styles.body}>
      <div className={`${styles.task}`}>
        <input type="checkbox" readOnly={true} />
        <h4 className={styles.task__title}>Task title</h4>
        <p>qwe</p>
        <p className={styles.task__assignee}>asd</p>
        <p className={styles.task__date}>12.02.2025; 12:00</p>
        <button>
          <FlagIcon />
        </button>
      </div>
    </div>
  );
};

export default TaskListItem;
