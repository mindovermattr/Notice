import { useAppSelector } from "@/store/hooks";
import { ComponentProps } from "react";
import Button from "../Button/Button";
import styles from "./Sidebar.module.scss";

type ISidebar = ComponentProps<"aside">;

const Sidebar = ({ className, ...props }: ISidebar) => {
  const user = useAppSelector((state) => state.user);
  return (
    <aside className={`${styles.sidebar} ${className}`} {...props}>
      <div className={styles.profile}>
        <div className={styles.profile__image}></div>
        <div className={styles.profile__information}>
          <h3
            className={styles.profile__name}
          >{`${user.user?.name} ${user.user?.lastname}`}</h3>
          <p className={styles.profile__email}>{user.user?.email}</p>
        </div>
      </div>
      <ul>
        <li>proj1</li>
      </ul>
      <div>
        <Button>Создать новый проект</Button>
      </div>
    </aside>
  );
};

export default Sidebar;
