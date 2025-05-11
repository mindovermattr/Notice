import { TCommentFindAll } from "@/@types/TComments";
import Image from "next/image";
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
      <div className={styles.history}>
        <article className={styles.history__comment}>
          <Image
            width={42}
            height={42}
            alt="Icon"
            src={"http://localhost:3001/api/yandex-disk/file/image.jpg"}
            className={styles.history__icon}
          />
          <div className={styles.history__body}>
            <div className={styles.history__wrapper}>
              <h3 className={styles.history__name}>Vade Waren</h3>
              <p className={styles.history__date}>created at</p>
            </div>
            <p className={styles.history__text}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea sunt
              iste doloribus, inventore iusto quos exercitationem distinctio
              asperiores possimus dicta fugit amet aut, ipsa accusamus
              temporibus dolores saepe deleniti minus!
            </p>
          </div>
        </article>
        <article className={styles.history__comment}>
          <Image
            width={42}
            height={42}
            alt="Icon"
            src={"http://localhost:3001/api/yandex-disk/file/image.jpg"}
            className={styles.history__icon}
          />
          <div className={styles.history__body}>
            <div className={styles.history__wrapper}>
              <h3 className={styles.history__name}>Vade Waren</h3>
              <p className={styles.history__date}>created at</p>
            </div>
            <p className={styles.history__text}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea sunt
              iste doloribus, inventore iusto quos exercitationem distinctio
              asperiores possimus dicta fugit amet aut, ipsa accusamus
              temporibus dolores saepe deleniti minus!
            </p>
          </div>
        </article>
        <article className={styles.history__comment}>
          <Image
            width={42}
            height={42}
            alt="Icon"
            src={"http://localhost:3001/api/yandex-disk/file/image.jpg"}
            className={styles.history__icon}
          />
          <div className={styles.history__body}>
            <div className={styles.history__wrapper}>
              <h3 className={styles.history__name}>Vade Waren</h3>
              <p className={styles.history__date}>created at</p>
            </div>
            <p className={styles.history__text}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea sunt
              iste doloribus, inventore iusto quos exercitationem distinctio
              asperiores possimus dicta fugit amet aut, ipsa accusamus
              temporibus dolores saepe deleniti minus!
            </p>
          </div>
        </article>
        <article className={styles.history__comment}>
          <Image
            width={42}
            height={42}
            alt="Icon"
            src={"http://localhost:3001/api/yandex-disk/file/image.jpg"}
            className={styles.history__icon}
          />
          <div className={styles.history__body}>
            <div className={styles.history__wrapper}>
              <h3 className={styles.history__name}>Vade Waren</h3>
              <p className={styles.history__date}>created at</p>
            </div>
            <p className={styles.history__text}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea sunt
              iste doloribus, inventore iusto quos exercitationem distinctio
              asperiores possimus dicta fugit amet aut, ipsa accusamus
              temporibus dolores saepe deleniti minus!
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Comments;
