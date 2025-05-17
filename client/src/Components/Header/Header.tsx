"use client";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/user.slice";
import { logoutUser } from "@/utils/user.utils";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import styles from "./Header.module.scss";

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
        qwe
      </Modal>
    </header>
  );
};

export default Header;
