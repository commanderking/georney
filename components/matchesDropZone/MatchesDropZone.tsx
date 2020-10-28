import React from "react";
import { useDropzone } from "react-dropzone";

const MatchesDropZone = () => {
  const onDrop = (acceptedFiles) => {
    console.log("acceptedFiles", acceptedFiles);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drop matches.json file here</p>
      )}
    </div>
  );
};

export default MatchesDropZone;
