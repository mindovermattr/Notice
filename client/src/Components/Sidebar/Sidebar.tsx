import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createProjectThunk } from "@/store/slices/projects.slice";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ComponentProps, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";
import styles from "./Sidebar.module.scss";

type ISidebar = ComponentProps<"aside"> & {};

const schema = z
  .object({
    name: z.string().nonempty("Имя не должно быть пустым"),
  })
  .strict();

const Sidebar = ({ className, ...props }: ISidebar) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const projects = useAppSelector((state) => state.projects);

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const submitHandler = async (data: z.infer<typeof schema>) => {
    await dispatch(createProjectThunk(data.name));
    setIsOpen(false);
  };
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
      <div className={styles["list-wrapper"]}>
        <h3 className={styles.list__title}>Ваши проекты:</h3>
        <ul className={styles.list}>
          {projects.projects.map((el) => (
            <li key={el.id}>
              <Link
                className={`${styles.list__link} ${
                  projects.selectedProject?.id === el.id
                    ? styles["list__link--selected"]
                    : ""
                }`}
                href={`/Project/${el.id}/Dashboard/Kanban`}
              >
                {el.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles["sidebar__button-wrapper"]}>
        <Button
          onClick={() => setIsOpen(true)}
          className={styles.sidebar__button}
        >
          Создать новый проект
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
          <fieldset className={styles.form__fieldset}>
            <div className={styles.form__field}>
              <Input
                {...register("name")}
                label="Имя проекта"
                placeholder="Имя"
                error={errors.name?.message}
              />
            </div>
          </fieldset>
          <Button>Создать проект</Button>
        </form>
      </Modal>
    </aside>
  );
};

export default Sidebar;
