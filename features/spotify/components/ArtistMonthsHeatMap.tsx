import React from "react";
import TimelineHeatmap from "components/timelineHeatMap/TimelineHeatmap";
import styles from "./ArtistMonthsHeatMap.module.scss";
import { getColorScaler } from "features/spotify/utils";
import moment from "moment";
import ReactTooltip from "react-tooltip";

const ArtistMonthsHeatMap = ({
  artists,
  startDate,
  endDate,
  showTooltip = true,
}) => {
  const colorScaler = getColorScaler(artists);

  const getColor = (value: number) => {
    if (value === 0) {
      return "white";
    }

    return colorScaler(value);
  };

  const titleDate =
    startDate &&
    endDate &&
    `${moment(startDate).format("MMM-YYYY")} - ${moment(endDate).format(
      "MMM-YYYY"
    )}`;

  return (
    <div className={styles.container}>
      <h3>Artist Play Frequency by Month ({titleDate})</h3>
      <div className={styles.chartContainer}>
        {
          // blank div for grid
        }
        <div></div>

        <TimelineHeatmap
          data={artists.formattedStreams}
          startDate={startDate}
          endDate={endDate}
          isHeaderRow
        />
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
      {showTooltip && (
        <ReactTooltip
          id="artistMonth"
          getContent={(dataTip) => {
            return (
              <p
                style={{
                  backgroundColor: "white",
                  padding: "10px",
                  border: "1px solid black",
                  fontSize: 16,
                }}
              >
                {dataTip} songs played
              </p>
            );
          }}
        ></ReactTooltip>
      )}
    </div>
  );
};

export default ArtistMonthsHeatMap;
