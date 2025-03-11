import styles from "./Board.module.scss";

const Board = () => {
  return (
    <section className={styles.board}>
      <aside className={styles.aside}></aside>
      <aside className={styles.board__sidebar}>side</aside>
      <div className={styles.board__tasks}>board</div>
    </section>
  );
};

export default Board;
