import { forwardRef, HTMLProps } from "react";
import styles from "./Input.module.scss";

type TInputProps = {
  label?: string;
  error?: string | undefined;
  as?: "input" | "textarea";
} & HTMLProps<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, TInputProps>(
  ({ id, label, error, className, as = "input", ...props }, ref) => {
    const Component = as;
    return (
      <>
        {label && (
          <label
            className={`${styles.label} ${error ? styles["label--error"] : ""}`}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <Component
          ref={ref}
          id={id}
          className={`${styles.input} ${className}`}
          {...props}
        />
        {error && <p className={`${styles.error} `}>{error}</p>}
      </>
    );
  }
);

export default Input;
