import TaskListItem from "./Item/TaskListItem";
import styles from './TaskList.module.scss'

const TaskList = () => {
  return (
    <div className={styles.tasklist}>
      <TaskListItem />
    </div>
  );
};

export default TaskList;
