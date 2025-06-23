import { TUserSchema, userSchema } from "@/@schemes/user.schema";
import { deleteProject, deleteUserFromProject } from "@/api/project.api";
import { patchUser, patchUserAvatar } from "@/api/user.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createProjectThunk,
  deleteUser,
  removeProject,
} from "@/store/slices/projects.slice";
import { setUser } from "@/store/slices/user.slice";
import { getUser, logoutUser, setUser as setUserLS } from "@/utils/user.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosProgressEvent } from "axios";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";
import FileUploader from "../FileUploader/FileUploader";
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isUplodaing, setIsUploading] = useState(false);

  const handleFileUpload = async (
    formData: FormData,
    onProgress: (progressEvent: AxiosProgressEvent) => void
  ) => {
    setIsUploading(true);
    try {
      const response = await patchUserAvatar(formData, onProgress);
      if (axios.isAxiosError(response)) return;
      dispatch(setUser(response.data));
      const user = getUser();
      if (!user) return;
      logoutUser();
      setUserLS({
        token: user.token,
        user: response.data,
      });
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setIsUploading(false);
    }
  };

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

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  const submitHandler = async (data: z.infer<typeof schema>) => {
    await dispatch(createProjectThunk(data.name));
    setIsOpen(false);
  };

  const userSubmitHandler = async (data: TUserSchema) => {
    const resp = await patchUser(data);
    if (axios.isAxiosError(resp)) return;
    const prevUser = getUser();
    setUserLS({
      user: resp.data,
      token: prevUser!.token,
    });
    dispatch(setUser(resp.data));
    setIsOpen(false);
  };

  const deleteProjectHandler = async (id: number) => {
    const resp = await deleteProject({ id });
    if (axios.isAxiosError(resp)) return;
    dispatch(removeProject({ id }));
    router.push("/Project");
  };
  const leaveProjectHandler = async (projectId: number, userId: number) => {
    const resp = await deleteUserFromProject({ projectId, userId });
    if (axios.isAxiosError(resp)) return;
    dispatch(deleteUser({ id: projectId, userId }));
    router.push("/Project");
  };
  return (
    <aside className={`${styles.sidebar} ${className}`} {...props}>
      <div className={styles.profile}>
        <Avatar
          imgSrc={user.user?.avatarUrl || "/icons/profile.svg"}
          width={32}
          height={32}
          className={styles.profile__image}
        />
        <div className={styles.profile__information}>
          <h3 className={styles.profile__name}>
            {`${user.user?.name} ${user.user?.lastname}`}
          </h3>
          <p className={styles.profile__email}>{user.user?.email}</p>
        </div>
        <Button
          onClick={() => setIsUserModalOpen(true)}
          variant="text"
          className={styles.profile__edit}
        >
          <Image width={18} height={18} src={"/icons/pen.svg"} alt="qwe" />
        </Button>
      </div>
      <div className={styles["list-wrapper"]}>
        <h3 className={styles.list__title}>Ваши проекты:</h3>
        <ul className={styles.list}>
          {projects.projects.map((el, idx) => (
            <li className={styles.list__item} key={el.id}>
              <Link
                className={clsx(styles.list__link, {
                  [styles["list__link--selected"]]:
                    projects.selectedProject?.id === el.id,
                })}
                href={`/Project/${el.id}/Dashboard/Tasklist`}
              >
                {`${idx + 1}. ${el.name}`}
              </Link>
              <div className={styles.controls}>
                {el.id === user.user?.id && (
                  <>
                    <Link
                      href={`/Project/${projects.selectedProject?.id}`}
                      className={styles.controls__button}
                    >
                      <Image
                        width={12}
                        height={12}
                        src="/icons/user.svg"
                        alt="1"
                      />
                    </Link>
                    <Button className={styles.controls__button} variant="text">
                      <Image
                        width={12}
                        height={12}
                        src="/icons/pen.svg"
                        alt="1"
                      />
                    </Button>
                  </>
                )}
                <Button
                  onClick={
                    el.author_id === user.user?.id
                      ? () => {
                          deleteProjectHandler(el.id);
                        }
                      : () => {
                          leaveProjectHandler(el.id, user!.user!.id);
                        }
                  }
                  className={styles.controls__button}
                  variant="text"
                >
                  x
                </Button>
              </div>
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
      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
        <form
          onSubmit={handleSubmitUser(userSubmitHandler)}
          className={styles.form}
        >
          <fieldset className={styles.form__fieldset}>
            <div className={styles.form__field}>
              <Input
                {...registerUser("name")}
                label="Имя"
                placeholder="Имя"
                error={userErrors.name?.message}
              />
              <Input
                {...registerUser("lastname")}
                label="Фамилия"
                placeholder="Фамилия"
                error={userErrors.lastname?.message}
              />
              <FileUploader
                onFileUpload={handleFileUpload}
                maxSize={5 * 1024 * 1024}
                accept=".jpg"
                disabled={isUplodaing}
              />
            </div>
          </fieldset>
          <Button>Изменить</Button>
        </form>
      </Modal>
    </aside>
  );
};

export default Sidebar;
