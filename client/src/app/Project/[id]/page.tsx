"use client";

import { ERolesBack } from "@/@types/Enums/ERoles";
import { changeUserRole, deleteUserFromProject } from "@/api/project.api";
import Button from "@/Components/Button/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  changeUserProjectRole,
  deleteUser,
} from "@/store/slices/projects.slice";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import styles from "./page.module.scss";

const page = () => {
  const dispatch = useAppDispatch();
  const selectedProject = useAppSelector(
    (state) => state.projects.selectedProject
  );
  const user = useAppSelector((state) => state.user.user);
  const params = useParams<{ id: string }>();

  const changeRoleHandler = async (userId: number, role: ERolesBack) => {
    const resp = await changeUserRole({
      projectId: +params.id,
      userId,
      role,
    });
    if (axios.isAxiosError(resp)) return;
    dispatch(
      changeUserProjectRole({
        id: +params.id,
        roleId: role,
        userId,
      })
    );
  };

  const deleteUserHandler = async (userId: number) => {
    const resp = await deleteUserFromProject({
      projectId: +params.id,
      userId,
    });
    if (axios.isAxiosError(resp)) return;
    dispatch(
      deleteUser({
        id: +params.id,
        userId,
      })
    );
  };

  return (
    <div className={styles.users}>
      <h1 className={styles.users__title}>Список пользователей</h1>
      {selectedProject?.users.map((el) => (
        <div key={el.id} className={styles.item}>
          {el.id !== selectedProject.author_id && (
            <p className={styles.item__name}>
              {el.role.role_id === ERolesBack.ADMIN
                ? "Администратор"
                : "Пользователь"}{" "}
              {el.name} {el.lastname}
            </p>
          )}
          <div className={styles.item__controls}>
            {el.id !== user?.id && (
              <>
                <Button
                  onClick={() => {
                    changeRoleHandler(
                      el.id,
                      el.role.role_id === 1 ? ERolesBack.USER : ERolesBack.ADMIN
                    );
                  }}
                >
                  <Image
                    width={16}
                    height={16}
                    src={"/icons/pen.svg"}
                    alt="edit"
                  />
                </Button>
                <Button
                  onClick={() => deleteUserHandler(el.id)}
                  className={styles.contols__delete}
                >
                  X
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
