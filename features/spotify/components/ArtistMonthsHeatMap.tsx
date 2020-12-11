import React from "react";
import TimelineHeatmap from "components/timelineHeatMap/TimelineHeatmap";
import styles from "./ArtistMonthsHeatMap.module.scss";

const ArtistMonthsHeatMap = ({ artists }) => {
  console.log("artists", artists);
  return (
    <div className={styles.container}>
      {artists.map((artist) => {
        console.log("artist", artist.formattedStreams);
        return (
          <React.Fragment>
            <div className={styles.artistText}>{artist.artistName}</div>
            <TimelineHeatmap data={artist.formattedStreams} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ArtistMonthsHeatMap;
