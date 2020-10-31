import React from "react";
import { useDropzone } from "react-dropzone";
import styles from "./styles.module.scss";

const MatchesDropZone = () => {
  const onDrop = (acceptedFiles) => {
    console.log("acceptedFiles", acceptedFiles);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={styles.wrapper} {...getRootProps()}>
      <input {...getInputProps()} accept=".json" />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drop matches.json file here</p>
      )}
    </div>
  );
};

export default MatchesDropZone;
