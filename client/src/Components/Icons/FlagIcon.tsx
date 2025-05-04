import styles from "./FlagIcon.module.scss";

type TFlagIconProps = {
  width?: number;
  height?: number;
  selected?: boolean;
};

const FlagIcon = ({
  height = 20,
  width = 20,
  selected = false,
}: TFlagIconProps) => {
  console.log(styles);
  return (
    <svg
      width={`${width}px`}
      height={`${height}px`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={`${styles.icon} ${selected ? styles["icon--selected"] : ""}`}
    >
      <g stroke-width="0"></g>
      <g stroke-linecap="round" stroke-linejoin="round"></g>
      <g>
        <g>
          <path d="M4 21V15.6871M4 15.6871C9.81818 11.1377 14.1818 20.2363 20 15.6869V4.31347C14.1818 8.86284 9.81818 -0.236103 4 4.31327V15.6871Z"></path>
        </g>
      </g>
    </svg>
  );
};

export default FlagIcon;
