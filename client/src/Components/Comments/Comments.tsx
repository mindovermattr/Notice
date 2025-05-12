import { TCommentFindAll } from "@/@types/TComments";
import { createComment } from "@/api/comment.api";
import { formatDate } from "@/utils/date.utils";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import styles from "./Comments.module.scss";

type TCommentsProps = {
  comments: TCommentFindAll[];
  user: TUser | null;
  addComment: (comment: TCommentFindAll) => void;
  taskId: number;
};

const Comments = ({ comments, user, addComment }: TCommentsProps) => {
  const [commentText, setCommentText] = useState("");
  const handleAddComment = async () => {
    if (!commentText.length) return;
    const resp = await createComment(2, commentText);
    if (axios.isAxiosError(resp)) return;
    addComment(resp.data);
    setCommentText("");
  };
  return (
    <section className={styles.comments}>
      <h3 className={styles.comments__title}>Обсуждение</h3>
      <form className={styles.comments__form}>
        <div className={styles.comments__body}>
          <Image
            width={42}
            height={42}
            alt="Icon"
            src={user?.avatarUrl || "/icons/profile.svg"}
            className={styles.history__icon}
          />
          <Input
            onChange={(e) => setCommentText(e.currentTarget.value)}
            value={commentText}
            className={styles.comments__textarea}
            placeholder="Комментарий"
            as="textarea"
          />
        </div>
        <Button
          onClick={handleAddComment}
          className={styles.comments__button}
          variant="outlined"
          type="button"
        >
          Добавить
        </Button>
      </form>
      <div className={styles.history}>
        {comments.map((el) => (
          <article key={el.id} className={styles.history__comment}>
            <Image
              width={42}
              height={42}
              alt="Icon"
              src={el.user.avatarUrl || "/icons/profile.svg"}
              className={styles.history__icon}
            />
            <div className={styles.history__body}>
              <div className={styles.history__wrapper}>
                <h3
                  className={styles.history__name}
                >{`${el.user.name} ${el.user.lastname}`}</h3>
                <p className={styles.history__date}>
                  {formatDate(el.createdAt)}
                </p>
              </div>
              <p className={styles.history__text}>{el.comment}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Comments;
