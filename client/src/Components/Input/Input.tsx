import { forwardRef, HTMLProps } from "react";
import styles from "./Input.module.scss";

type TInputProps = {
  label?: string;
  error?: string | undefined;
} & HTMLProps<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, TInputProps>(
  ({ id, label, error, className, ...props }, ref) => {
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
        <input
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
