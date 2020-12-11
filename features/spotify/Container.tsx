import React from "react";
import streamOne from "data/spotify_streaming_1.json";
import streamZero from "data/spotify_streaming_0.json";
import {
  getTrackCounts,
  getStreamsByArtistName,
  getTopArtistStreams,
} from "features/spotify/utils";
import TrackTable from "features/spotify/components/TrackTable";
import ArtistTable from "features/spotify/components/ArtistTable";
import ArtistMonthsHeatMap from "features/spotify/components/ArtistMonthsHeatMap";

const SpotifyContainer = () => {
  const tracks = getTrackCounts([...streamZero, ...streamOne]);
  const artists = getStreamsByArtistName([...streamZero, ...streamOne]);

  const topArtistStreams = getTopArtistStreams(artists);
  console.log("topArtistStreams", topArtistStreams);
  return (
    <div>
      <a
        target="_blank"
        href="https://support.spotify.com/us/article/data-rights-and-privacy-settings/"
      >
        How to Download Data from Spotify
      </a>
      <TrackTable data={tracks} />
      <ArtistTable data={artists} />
      <ArtistMonthsHeatMap artists={topArtistStreams} />
    </div>
  );
};

export default SpotifyContainer;
