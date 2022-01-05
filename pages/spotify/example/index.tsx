import SpotifyExample from "features/spotify/components/Example";
import streamOne from "data/StreamingHistory0.json";
import streamZero from "data/StreamingHistory1.json";

const SpotifyExamplePage = () => {
  const exampleStreams = [...streamZero, ...streamOne];

  return (
    <div>
      <SpotifyExample streams={exampleStreams} />
    </div>
  );
};

export default SpotifyExamplePage;
