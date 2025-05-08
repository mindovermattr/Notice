import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.header__title}>Track</h1>
      <button className={styles.header__profile}>X</button>
    </header>
  );
};

export default Header;
