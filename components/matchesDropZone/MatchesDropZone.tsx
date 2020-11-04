import React, { useContext } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./styles.module.scss";
import { UserMatchesContext } from "context/UserMatchesProvider";
type Props = {
  onDrop: (json: any) => void;
};

const MatchesDropZone = ({ onDrop }: Props) => {
  const { data, setData } = useContext(UserMatchesContext);

  console.log("data", data);
  console.log("setData", setData);
  const handleDrop = (acceptedFiles) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        const json = JSON.parse(reader.result);
        console.log("json", json);
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
