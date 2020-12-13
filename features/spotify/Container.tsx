import React from "react";
import streamOne from "data/spotify_streaming_1.json";
import streamZero from "data/spotify_streaming_0.json";
import {
  getTrackCounts,
  getStreamsByArtistName,
  getTopArtistStreams,
  getStartAndEndDate,
} from "features/spotify/utils";
import TrackTable from "features/spotify/components/TrackTable";
import ArtistTable from "features/spotify/components/ArtistTable";
import ArtistMonthsHeatMap from "features/spotify/components/ArtistMonthsHeatMap";
import styles from "./styles.module.scss";

const SpotifyContainer = () => {
  const streams = [...streamZero, ...streamOne];
  const tracks = getTrackCounts(streams);
  const artists = getStreamsByArtistName(streams);

  const { startDate, endDate } = getStartAndEndDate(streams);

  const topArtistStreams = getTopArtistStreams(artists);
  return (
    <div className={styles.container}>
      <ArtistMonthsHeatMap
        artists={topArtistStreams}
        startDate={startDate}
        endDate={endDate}
      />
      <ArtistTable data={artists} />
      <TrackTable data={tracks} />
      <a
        target="_blank"
        href="https://support.spotify.com/us/article/data-rights-and-privacy-settings/"
      >
        How to Download Data from Spotify
      </a>
    </div>
  );
};

export default SpotifyContainer;
