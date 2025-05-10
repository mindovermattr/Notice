import { TCommentFindAll } from "@/@types/TComments";
import Button from "../Button/Button";
import Input from "../Input/Input";
import styles from "./Comments.module.scss";

type TCommentsProps = {
  comments: TCommentFindAll[];
  user: TUser;
};

const Comments = ({ comments, user }: TCommentsProps) => {
  return (
    <section className={styles.comments}>
      <h3 className={styles.comments__title}>Обсуждение</h3>
      <form className={styles.comments__form}>
        <div className={styles.comments__body}>
          <div>Logo</div>
          <Input
            className={styles.comments__textarea}
            placeholder="Комментарий"
            as="textarea"
          />
        </div>
        <Button className={styles.comments__button} variant="outlined">
          Добавить
        </Button>
      </form>
      <div></div>
    </section>
  );
};

export default Comments;
