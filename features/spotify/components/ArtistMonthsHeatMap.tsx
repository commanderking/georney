import React, { useEffect, useState } from "react";
import TimelineHeatmap from "components/timelineHeatMap/TimelineHeatmap";
import styles from "./ArtistMonthsHeatMap.module.scss";
import { getColorScaler, getClustersLegendData } from "features/spotify/utils";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import { redColorScale } from "features/spotify/constants";
import HeatMapLegend from "features/spotify/components/HeatMapLegend";

const ArtistMonthsHeatMap = ({ artists, startDate, endDate }) => {
  // Whole showTooltip issue seems related to next.js and SSR issue
  // https://stackoverflow.com/questions/64079321/react-tooltip-and-next-js-ssr-issue
  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    setShowTooltip(true);
  }, []);
  const colorScaler = getColorScaler(artists, startDate, endDate);
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
      <p style={{ fontStyle: "italic" }}>
        Your top 20 artists — starting with the overall most played artist
      </p>
      <div className={styles.chartArea}>
        <HeatMapLegend legendMap={legendData} />

        <div
          className={styles.chartContainer}
          style={{ maxWidth: 550, overflowX: "scroll" }}
        >
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
      </div>
      {showTooltip && (
        <ReactTooltip
          id="artistMonth"
          getContent={(dataTip) => {
            return `${dataTip} songs played`;
          }}
        ></ReactTooltip>
      )}
    </div>
  );
};

export default ArtistMonthsHeatMap;
