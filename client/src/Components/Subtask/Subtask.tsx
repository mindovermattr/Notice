import { subtaskSchema } from "@/@schemes/subtask.schema";
import { TSubtask } from "@/@types/TSubtask";
import { deleteSubTask, updateSubTask } from "@/api/subtask.api";
import { useAppDispatch } from "@/store/hooks";
import { deleteSubtask, patchSubtask } from "@/store/slices/tasklists.slice";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../Button/Button";
import FlagIcon from "../Icons/FlagIcon/FlagIcon";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";
import styles from "./Subtask.module.scss";

type TProps = {
  subtask: TSubtask;
  taskId: number;
  listId: number;
  isRedacting: boolean;
};

const Subtask = ({ subtask, taskId, listId, isRedacting }: TProps) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const subtaskForm = useForm({
    resolver: zodResolver(subtaskSchema),
    defaultValues: {
      title: subtask.title,
    },
  });
  console.log(isRedacting);
  const subtaskSubmitHandler = async (data: z.infer<typeof subtaskSchema>) => {
    const resp = await updateSubTask(subtask.id, data);
    if (axios.isAxiosError(resp)) return;
    dispatch(patchSubtask({ subtask: resp.data, listId, taskId }));
    setIsOpen(false);
  };
  const deleteHandler = async () => {
    const resp = await deleteSubTask(subtask.id);
    if (axios.isAxiosError(resp)) return;
    dispatch(deleteSubtask({ subtask: resp.data, listId, taskId }));
  };
  const completeSubtask = async (subtask: TSubtask) => {
    const resp = await updateSubTask(subtask.id, {
      ...subtask,
      isCompleted: !subtask.isCompleted,
    });
    if (axios.isAxiosError(resp)) return;
    dispatch(patchSubtask({ subtask: resp.data, listId, taskId }));
  };
  return (
    <div className={styles.subtask} key={subtask.id}>
      <h4>{subtask.title}</h4>
      {!isRedacting && (
        <div className={styles.subtask__controls}>
          <Button
            onClick={() => completeSubtask(subtask)}
            variant="outlined"
            className={styles.subtask__button}
          >
            <FlagIcon selected={subtask.isCompleted} width={16} height={16} />
          </Button>
          <Button
            onClick={() => setIsOpen(true)}
            variant="outlined"
            className={styles.subtask__button}
          >
            <Image width={14} height={14} src={"/icons/pen.svg"} alt="" />
          </Button>
          <Button
            onClick={deleteHandler}
            variant="outlined"
            className={styles.subtask__button}
          >
            X
          </Button>
        </div>
      )}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form
          onSubmit={subtaskForm.handleSubmit(subtaskSubmitHandler)}
          className={styles["subtask-form"]}
        >
          <Input
            {...subtaskForm.register("title")}
            label="Название подзадачи"
            placeholder="Кратко сформулируйте, что нужно сделать"
            error={subtaskForm.formState.errors.title?.message}
          />
          <Button>Изменить</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Subtask;
