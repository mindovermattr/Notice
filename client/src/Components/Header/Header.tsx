import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.header__title}>Notice</h1>
      <button className={styles.header__profile}>МН</button>
    </header>
  );
};

export default Header;
