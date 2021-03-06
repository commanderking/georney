import React, { ReactNode, useContext } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./styles.module.scss";
import { UserMatchesContext } from "context/UserMatchesProvider";
import Link from "next/link";

type Props = {
  onDrop?: (json: any) => void;
  acceptsMultipleFiles?: boolean;
  textPreDrop?: string | ReactNode;
  textPostDrop?: string | ReactNode;
};

const MatchesDropZone = ({
  onDrop,
  acceptsMultipleFiles = false,
  textPreDrop,
  textPostDrop,
}: Props) => {
  const { data, setData } = useContext(UserMatchesContext);

  const handleDrop = (acceptedFiles) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        const json = JSON.parse(reader.result);
        // @ts-ignore
        setData(json);
      }
    };

    if (acceptedFiles.length) {
      reader.readAsBinaryString(acceptedFiles[0]);
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
  } = useDropzone({
    onDrop: onDrop || handleDrop,
    accept: ".json",
    multiple: acceptsMultipleFiles,
  });

  const getContent = () => {
    if (isDragActive) {
      return <p>Over here!!</p>;
    }

    if (acceptedFiles.length === 0) {
      return textPreDrop || <p>Drop matches.json file here</p>;
    }
  };

  if (acceptedFiles.length > 0) {
    return (
      <div className={styles.filesWrapper}>
        <h3>Files Uploaded</h3>
        <div>
          {acceptedFiles.map((acceptedFile) => (
            <div>{acceptedFile.name}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper} {...getRootProps()}>
      <input {...getInputProps()} accept=".json" />
      {getContent()}
    </div>
  );
};

export default MatchesDropZone;
