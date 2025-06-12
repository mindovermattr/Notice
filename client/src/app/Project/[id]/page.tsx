"use client";

import Button from "@/Components/Button/Button";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import styles from "./page.module.scss";

const page = () => {
  const selectedProject = useAppSelector(
    (state) => state.projects.selectedProject
  );

  return (
    <div className={styles.users}>
      <h1 className={styles.users__title}>Список пользователей</h1>
      {selectedProject?.users.map((el) => (
        <div key={el.id} className={styles.item}>
          <p className={styles.item__name}>
            {selectedProject.author_id === el.id
              ? "Администратор"
              : "Пользователь"}{" "}
            {el.name} {el.lastname}
          </p>
          <div className={styles.item__controls}>
            <Button>
              <Image width={16} height={16} src={"/icons/pen.svg"} alt="edit" />
            </Button>
            <Button className={styles.contols__delete}>X</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
