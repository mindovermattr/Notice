import { HTMLProps } from "react";
import styles from "./Typography.module.scss";

type TTypography = HTMLProps<HTMLDivElement> & {
  tag?: "div" | "h1" | "h2" | "p" | "span";
};

const FONT = {
  base700: "",
} as const;

const Typography = ({ tag = "p", children }: TTypography) => {
  const Component = tag;
  return <Component className={`${styles.qwe}`}>{children}</Component>;
};

export default Typography;
