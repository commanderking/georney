import React from "react";
import TimelineHeatmap from "components/timelineHeatMap/TimelineHeatmap";
import styles from "./ArtistMonthsHeatMap.module.scss";
import { getColorScaler, getClustersLegendData } from "features/spotify/utils";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import { redColorScale } from "features/spotify/constants";
import HeatMapLegend from "features/spotify/components/HeatMapLegend";

const ArtistMonthsHeatMap = ({
  artists,
  startDate,
  endDate,
  showTooltip = true,
}) => {
  const colorScaler = getColorScaler(artists);
  // clusters only contain the division between clusters, so we'll always be one short.
  // Assume 0 is not included in the first color so start count at one.
  const clusters = [1, ...colorScaler.clusters()];
  const legendData = getClustersLegendData(redColorScale, clusters);

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
      <div className={styles.chartArea}>
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
                <div>
                  <div className={styles.artistText}>{artist.artistName}</div>
                </div>
                <div>
                  <TimelineHeatmap
                    data={artist.formattedStreams}
                    getColor={getColor}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <HeatMapLegend legendMap={legendData} />
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
