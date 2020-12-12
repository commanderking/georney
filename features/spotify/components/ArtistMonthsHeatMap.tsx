import React from "react";
import TimelineHeatmap from "components/timelineHeatMap/TimelineHeatmap";
import styles from "./ArtistMonthsHeatMap.module.scss";
import { getColorScaler, getStartAndEndDate } from "features/spotify/utils";

const ArtistMonthsHeatMap = ({ artists, startDate, endDate }) => {
  const colorScaler = getColorScaler(artists);

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
              startDate={startDate}
              endDate={endDate}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ArtistMonthsHeatMap;
