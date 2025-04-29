import React from "react";
import styles from "./layout.module.scss";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <main className={styles.layout}>{children}</main>;
};

export default AuthLayout;
