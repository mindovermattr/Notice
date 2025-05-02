import { ComponentPropsWithoutRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";

type TModalProps = {
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
} & ComponentPropsWithoutRef<"div">;

const portalElement = document.getElementById("portal");

const Modal = ({
  children,
  isOpen,
  closeOnOverlayClick = true,
  onClose,
  ...props
}: TModalProps) => {
  //   useEffect(() => {
  //     if (isOpen) document.body.style.overflow = "hidden";
  //     else document.body.style.overflow = "";

  //     return () => {
  //       document.body.style.overflow = "";
  //     };
  //   }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <>
      {isOpen && (
        <div className={styles["modal-wrapper"]} onClick={handleOverlayClick}>
          <div className={styles.modal}>
            <button onClick={onClose} className={styles.modal__close}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.modal__button}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {children}
            <div>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa
              deleniti placeat quisquam nisi non in incidunt corporis pariatur
              voluptate quia illum eius, sunt suscipit expedita qui quas quod
              facere mollitia?
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
};

export default Modal;
