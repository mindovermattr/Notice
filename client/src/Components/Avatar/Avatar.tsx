import clsx from "clsx";
import Image from "next/image";
import styles from "./Avatar.module.scss";

type TAvatar = {
  imgSrc: string | undefined | null;
  width: number;
  height: number;
  className?: string;
};

const Avatar = ({ imgSrc, className, height, width }: TAvatar) => {
  return (
    <Image
      width={width}
      height={height}
      src={imgSrc || '/icons/profile.svg'}
      alt="Аватар"
      className={clsx(styles.avatar, className)}
    />
  );
};

export default Avatar;
