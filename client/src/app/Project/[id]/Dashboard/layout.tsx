"use client";
import Tab from "@/Components/Tab/Tab";
import { ReactNode } from "react";
import styles from "./layout.module.scss";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.wrapper}>
      <Tab className={styles.tab} />
      {children}
    </div>
  );
};

export default layout;
