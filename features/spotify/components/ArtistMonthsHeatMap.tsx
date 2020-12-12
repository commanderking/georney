import React from "react";
import TimelineHeatmap from "components/timelineHeatMap/TimelineHeatmap";
import styles from "./ArtistMonthsHeatMap.module.scss";
import { getColorScaler } from "features/spotify/utils";

const ArtistMonthsHeatMap = ({ artists }) => {
  const colorScaler = getColorScaler(artists);

  const clusters = colorScaler.clusters();

  const getColor = (value: number) => {
    if (value === 0) {
      return "white";
    }

    return colorScaler(value);
  };

  return (
    <div className={styles.container}>
      {artists.map((artist, index) => {
        return (
          <React.Fragment key={`${artist.artistName}-${index}`}>
            <div className={styles.artistText}>{artist.artistName}</div>
            <TimelineHeatmap
              data={artist.formattedStreams}
              getColor={getColor}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ArtistMonthsHeatMap;
