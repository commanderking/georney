import React, { useContext } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./styles.module.scss";
import { UserMatchesContext } from "context/UserMatchesProvider";
import Link from "next/link";

type Props = {
  onDrop: (json: any) => void;
};

const MatchesDropZone = () => {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: ".json",
    multiple: false,
  });

  const getContent = () => {
    if (isDragActive) {
      return <p>Over here!!</p>;
    }

    if (data.length === 0) {
      return <p>Drop matches.json file here</p>;
    }
  };

  if (data.length > 0) {
    return (
      <div className={styles.buttonWrapper}>
        <Link href="/visualize">
          <button className={styles.button}>Visualize Data</button>
        </Link>
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
