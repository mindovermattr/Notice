import { AxiosProgressEvent } from "axios";
import clsx from "clsx";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import styles from "./FileUploader.module.scss";

type FileUploaderProps = {
  onFileUpload: (
    formData: FormData,
    onProgress: (progressEvent: AxiosProgressEvent) => void
  ) => void | Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
};

const FileUploader = ({
  onFileUpload,
  accept = "*",
  multiple = false,
  maxSize,
  disabled = false,
}: FileUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptedExtensions = (): string[] => {
    if (accept === "*") return [];
    return accept.split(",").map((ext) => ext.trim().toLowerCase());
  };

  const isFileTypeValid = (file: File): boolean => {
    const acceptedExtensions = getAcceptedExtensions();
    if (acceptedExtensions.length === 0) return true;

    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

    return acceptedExtensions.some((ext) => {
      if (ext.endsWith("/*")) {
        const mimeType = ext.split("/")[0];
        return file.type.startsWith(mimeType);
      }
      if (ext.startsWith(".")) {
        return `.${fileExtension}` === ext;
      }
      return file.type === ext;
    });
  };

  const validateFiles = (files: File[]): boolean => {
    setError(null);
    const errors: string[] = [];
    if (accept !== "*") {
      const invalidTypeFiles = files.filter((file) => !isFileTypeValid(file));
      if (invalidTypeFiles.length > 0) {
        errors.push(
          `Некоторые файлы не соответствуют разрешенным типам: ${accept}. ` +
            `Неподходящие файлы: ${invalidTypeFiles
              .map((f) => f.name)
              .join(", ")}`
        );
      }
    }

    if (!maxSize) return true;

    const invalidFiles = files.filter((file) => file.size > maxSize);
    if (invalidFiles.length > 0) {
      setError(
        `Некоторые файлы превышают максимальный размер ${
          maxSize / 1024 / 1024
        }MB`
      );
    }

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return false;
    }

    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    if (!validateFiles(files)) return;

    setSelectedFiles(files);
    setError(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;

    setIsDragging(false);
    if (!e.dataTransfer.files) return;

    const files = Array.from(e.dataTransfer.files);
    if (!validateFiles(files)) return;

    setSelectedFiles(files);
    setError(null);
  };

  const uploadFiles = async (files: File[]) => {
    try {
      setUploadProgress(0);

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      await onFileUpload(formData, (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });
    } catch (err) {
      setError("Ошибка при загрузке файлов");
      console.error("Upload error:", err);
    } finally {
      setUploadProgress(null);
    }
  };

  const triggerFileInput = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  return (
    <div
      className={clsx(styles["file-uploader"], {
        [styles.dragging]: isDragging,
        [styles.disabled]: disabled,
      })}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        style={{ display: "none" }}
      />
      <div
        className={styles["upload-area"]}
        onClick={triggerFileInput}
        aria-disabled={disabled}
      >
        {uploadProgress !== null ? (
          <div className={styles["progress-bar"]}>
            <div
              className={styles.progress}
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <span>{uploadProgress}%</span>
          </div>
        ) : (
          <>
            <p>
              {disabled
                ? "Загрузка отключена"
                : "Перетащите файлы сюда или кликните для выбора"}
            </p>
            <p className={styles.hint}>
              {accept === "*"
                ? "Любые файлы"
                : `Поддерживаемые форматы: ${accept}`}
              {maxSize && `, макс. размер: ${maxSize / 1024 / 1024}MB`}
            </p>
          </>
        )}
      </div>
      {error && <div className={styles["error-message"]}>{error}</div>}
      {selectedFiles.length > 0 && uploadProgress === null && (
        <div className={styles["file-list"]}>
          <h4>Выбранные файлы:</h4>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                <span>
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </span>
                {!disabled && (
                  <button
                    onClick={() => removeFile(index)}
                    className={styles["remove-button"]}
                    aria-label={`Удалить ${file.name}`}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
          {!disabled && (
            <button
              onClick={() => uploadFiles(selectedFiles)}
              className={styles["upload-button"]}
            >
              Загрузить
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
