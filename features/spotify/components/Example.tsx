import React, { useMemo } from "react";
import ArtistMonthsHeatMap from "features/spotify/components/ArtistMonthsHeatMap";
import streamOne from "data/StreamingHistory0.json";
import streamZero from "data/StreamingHistory1.json";

import {
  getTrackCounts,
  getStreamsByArtistName,
  getTopArtistStreams,
  getStartAndEndDate,
} from "features/spotify/utils";
import ArtistTable from "features/spotify/components/ArtistTable";
import TrackTable from "features/spotify/components/TrackTable";
import styles from "../styles.module.scss";

export const SpotifyExample = () => {
  const streams = [...streamZero, ...streamOne];
  const artists = useMemo(
    () => [...getStreamsByArtistName(streams)].slice(0, 100),
    []
  );
  const tracks = [...getTrackCounts(streams)].slice(0, 100);

  const { endDate } = useMemo(() => getStartAndEndDate(streams), []);

  const topArtistStreams = useMemo(() => getTopArtistStreams(artists, 20), []);

  return (
    <div className={styles.example}>
      <ArtistMonthsHeatMap
        artists={topArtistStreams}
        // temporary - just for current visualization
        startDate={new Date("2020-01-02")}
        endDate={endDate}
      />
      <ArtistTable data={artists} />
      <TrackTable data={tracks} />
    </div>
  );
};

export default SpotifyExample;
