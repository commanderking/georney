import React from "react";
import streamOne from "data/spotify_streaming_1.json";
import streamZero from "data/spotify_streaming_0.json";
import { getTrackCounts } from "features/spotify/utils";
import TrackTable from "features/spotify/components/TrackTable";

const SpotifyContainer = () => {
  const tracks = getTrackCounts([...streamZero, ...streamOne]);
  console.log("test", tracks);
  return (
    <div>
      <h1>Spotify Land</h1>
      <TrackTable data={tracks} />
    </div>
  );
};

export default SpotifyContainer;
