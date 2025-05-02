"use client";
import Tab from "@/Components/Tab/Tab";
import { ReactNode } from "react";
import styles from "./layout.module.scss";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Tab className={styles.tab} />
      {children}
    </>
  );
};

export default layout;
