import { HTMLProps } from "react";
import styles from "./Sidebar.module.scss";

type ISidebar = HTMLProps<HTMLElement>;

const Sidebar = ({ className, ...props }: ISidebar) => {
  return (
    <aside className={`${styles.sidebar} ${className}`} {...props}>
      <div className={styles.profile}>
        <div className={styles.profile__image}></div>
        <div className={styles.profile__information}>
          <h3 className={styles.profile__name}>John Smith</h3>
          <p className={styles.profile__email}>johnsmith@mail.ru</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
