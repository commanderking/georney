import React, { useState, useContext } from "react";
import Example from "features/spotify/components/Example";
import styles from "features/hinge/styles.module.scss";
import Head from "next/head";
import DropZone from "components/matchesDropZone/MatchesDropZone";
import { validateStreamHistoryFiles } from "./utils";
import { isArray } from "@material-ui/data-grid";
import streamOne from "data/StreamingHistory0.json";
import streamZero from "data/StreamingHistory1.json";
import { GlobalContext } from "context/GlobalProvider";
import Link from "next/link";
import Button from "components/button/Button";

const getHandleDrop = (setData, setError) => (acceptedFiles) => {
  if (acceptedFiles.length) {
    let fileData = [];
    for (const file of acceptedFiles) {
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const json = JSON.parse(reader.result);

          if (isArray(json)) {
            setError(null);
            fileData = [...fileData, ...json];
            setData(fileData);
          }
          setError("One of the files added is not streaming history");
        }
      };
    }
  }
};

const SpotifyContainer = () => {
  const exampleStreams = [...streamZero, ...streamOne];

  const { userSpotifyData, setUserSpotifyData } = useContext(GlobalContext);
  const [error, setError] = useState(null);
  const [validFiles, setValidFiles] = useState<Blob[]>();

  const isUploadDataValid = Boolean(
    validateStreamHistoryFiles(userSpotifyData) && userSpotifyData.length
  );

  return (
    <div className={styles.container} style={{ minWidth: "600px" }}>
      <Head>
        <title>Georney - Visualize Spotify Data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.splash}>
          <h1 className={styles.title}>Visualize Your Spotify Data</h1>
          <DropZone
            acceptsMultipleFiles
            textPreDrop={<p>Drop All StreamingHistory.json files here.</p>}
            onDrop={getHandleDrop(setUserSpotifyData, setError)}
          />
          {!isUploadDataValid && (
            <div>
              <small className={styles.dropZoneText}>
                File is NOT uploaded and is NEVER saved. Verify{" "}
                <a
                  href="https://github.com/commanderking/georney"
                  target="_blank"
                >
                  the code
                </a>
                .
              </small>

              <p>
                Don't have your data?{" "}
                <a
                  target="_blank"
                  href="https://support.spotify.com/us/article/data-rights-and-privacy-settings/"
                >
                  Download from Spotify
                </a>
              </p>
            </div>
          )}

          {isUploadDataValid && (
            <div>
              <Button
                onClick={() => {
                  location.reload();
                }}
              >
                Reselect Files
              </Button>
              <Link href="/spotify/visualize">
                <Button>Visualize Data</Button>
              </Link>
            </div>
          )}
        </div>
        <h2>Example Visualizations</h2>
        <Example
          streams={exampleStreams}
          customStartDate={new Date("2020-01-02")}
        />
      </main>
    </div>
  );
};

export default SpotifyContainer;
