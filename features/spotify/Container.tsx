import React from "react";
import streamOne from "data/spotify_streaming_1.json";
import streamZero from "data/spotify_streaming_0.json";
import { getTrackCounts, getStreamsByArtistName } from "features/spotify/utils";
import TrackTable from "features/spotify/components/TrackTable";
import ArtistTable from "features/spotify/components/ArtistTable";
const SpotifyContainer = () => {
  const tracks = getTrackCounts([...streamZero, ...streamOne]);
  const artists = getStreamsByArtistName([...streamZero, ...streamOne]);

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
    </div>
  );
};

export default SpotifyContainer;
