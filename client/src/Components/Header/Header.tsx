"use client";
import { addUserToProject } from "@/api/project.api";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/user.slice";
import { logoutUser } from "@/utils/user.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";
import styles from "./Header.module.scss";

const schema = z.object({
  email: z.string().email(),
});

const Header = () => {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const onLogout = () => {
    dispatch(logout());
    logoutUser();
    router.push("/auth/login");
  };

  const formHandler = useForm({
    resolver: zodResolver(schema),
  });
  const addUser = async (data: z.infer<typeof schema>) => {
    await addUserToProject(+id, data.email);
    setIsUserModalOpen(false);
  };
  return (
    <header className={styles.header}>
      <h1 className={styles.header__title}>Track</h1>
      {id && (
        <Button onClick={() => setIsUserModalOpen(true)}>
          Добавить пользователя
        </Button>
      )}
      <button
        onClick={() => setIsLogoutModalOpen(true)}
        className={styles.header__profile}
      >
        X
      </button>
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        className={styles["logout-modal"]}
      >
        <h3 className={styles["logout-modal__title"]}>Хотите выйти?</h3>
        <div className={styles["logout-modal__controls"]}>
          <Button onClick={onLogout}>Да, выйти</Button>
          <Button
            onClick={() => setIsLogoutModalOpen(false)}
            variant="outlined"
          >
            Нет, остаться
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        className={styles["user-modal"]}
      >
        <form
          onSubmit={formHandler.handleSubmit(addUser)}
          className={styles.form}
        >
          <Input
            {...formHandler.register("email")}
            label="Электронная почта"
            placeholder="test@example.com"
          />
          <Button>Добавить пользователя</Button>
        </form>
      </Modal>
    </header>
  );
};

export default Header;
