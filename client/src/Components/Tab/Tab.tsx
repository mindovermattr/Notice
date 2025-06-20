import { useAppDispatch } from "@/store/hooks";
import { createTasklistThunk } from "@/store/slices/tasklists.slice";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { HTMLProps, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";
import styles from "./Tab.module.scss";

type TTab = HTMLProps<HTMLElement>;

const schema = z
  .object({
    title: z.string().nonempty("Имя не должно быть пустым"),
  })
  .strict();

const Tab = ({ className, ...props }: TTab) => {
  const selectedSegment = useSelectedLayoutSegment();
  const { id } = useParams<{ id?: string }>();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
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
    if (!id) return;
    await dispatch(createTasklistThunk({ id: +id, title: data.title }));
    setIsOpen(false);
  };

  return (
    <>
      <header className={`${styles.tab} ${className}`} {...props}>
        <div className={styles.tab__links}>
          <Link
            href={`/Project/${id}/Dashboard/Tasklist`}
            className={`${styles.tab__option} ${
              selectedSegment === "Tasklist"
                ? styles["tab__option--selected"]
                : ""
            }`}
          >
            <Image
              width={24}
              height={24}
              src="/icons/list.svg"
              alt="board-icon"
            />
            <p className={styles.tab__text}>Список</p>
          </Link>
          <Link
            href={`/Project/${id}/Dashboard/Kanban`}
            className={`${styles.tab__option} ${
              selectedSegment === "Kanban"
                ? styles["tab__option--selected"]
                : ""
            }`}
          >
            <Image
              width={24}
              height={24}
              src="/icons/dashboard.svg"
              alt="board-icon"
            />
            <p className={styles.tab__text}>Канбан</p>
          </Link>
          <Link
            href={`/Project/${id}/Dashboard/Gantt`}
            className={`${styles.tab__option} ${
              selectedSegment === "Gantt" ? styles["tab__option--selected"] : ""
            }`}
          >
            <Image
              width={24}
              height={24}
              src="/icons/gantt.svg"
              alt="board-icon"
            />
            <p className={styles.tab__text}>Гант</p>
          </Link>
        </div>
        {selectedSegment === "Tasklist" && (
          <Button data-testid="create-button" onClick={() => setIsOpen(true)}>
            Создать
          </Button>
        )}
      </header>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
          <Input
            id="list"
            label="Имя списка"
            {...register("title")}
            error={errors.title?.message}
          />
          <Button data-testid="modal-button">Создать</Button>
        </form>
      </Modal>
    </>
  );
};

export default Tab;
