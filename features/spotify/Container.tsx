import React, { useState, useRef, useEffect } from "react";
import Example from "features/spotify/components/Example";
import styles from "features/hinge/styles.module.scss";
import Head from "next/head";
import DropZone from "components/matchesDropZone/MatchesDropZone";
import { validateStreamHistoryFiles } from "./utils";
import { isArray } from "@material-ui/data-grid";
import streamOne from "data/StreamingHistory0.json";
import streamZero from "data/StreamingHistory1.json";

const getHandleDrop = (setData, setError) => (acceptedFiles) => {
  if (acceptedFiles.length) {
    let fileData = [];
    for (const file of acceptedFiles) {
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onloadend = (file) => {
        console.log("load end", reader.result);

        if (typeof reader.result === "string") {
          const json = JSON.parse(reader.result);

          if (isArray(json)) {
            setError(null);
            setData([...fileData, ...json]);
          }
          setError("One of the files added is not streaming history");
        }
      };
    }
  }
};

const SpotifyContainer = () => {
  const [spotifyData, setSpotifyData] = useState([]);
  const [error, setError] = useState(null);
  const exampleStreams = [...streamZero, ...streamOne];

  console.log("spotifyData", spotifyData);

  const isUploadDataValid = Boolean(
    validateStreamHistoryFiles(spotifyData) && spotifyData.length
  );
  console.log("isUploadDataValid", isUploadDataValid);
  return (
    <div className={styles.container}>
      <Head>
        <title>Georney</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.splash}>
          <h1 className={styles.title}>Visualize Your Spotify Data</h1>
          <DropZone
            acceptsMultipleFiles
            textPreDrop={<p>Drop All StreamingHistory.json files here.</p>}
            onDrop={getHandleDrop(setSpotifyData, setError)}
          />
        </div>
        {isUploadDataValid && <Example streams={spotifyData} />}
        {!isUploadDataValid && (
          <Example
            streams={exampleStreams}
            customStartDate={new Date("2020-01-02")}
          />
        )}
        <a
          target="_blank"
          href="https://support.spotify.com/us/article/data-rights-and-privacy-settings/"
        >
          How to Download Data from Spotify
        </a>
      </main>
    </div>
  );
};

export default SpotifyContainer;
