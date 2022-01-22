import SpotifyExample from "features/spotify/components/Example";
import streamOne from "data/StreamingHistory0.json";
import streamZero from "data/StreamingHistory1.json";
import extendedHistory0 from "data/extendedHistory/endsong_0.json";
import extendedHistory1 from "data/extendedHistory/endsong_1.json";
import extendedHistory2 from "data/extendedHistory/endsong_2.json";
import { convertExtendedStreamToRawStream } from "features/spotify/utils";

const SpotifyExamplePage = () => {
  const exampleStreams = [...streamZero, ...streamOne];

  const extendedStreams = convertExtendedStreamToRawStream([
    // @ts-ignore - json file too big so can't tell it's [] and not {} ?
    ...extendedHistory0,
    // @ts-ignore
    ...extendedHistory1,
    // @ts-ignore
    ...extendedHistory2,
  ]);

  return (
    <div>
      <SpotifyExample streams={exampleStreams} />
      <SpotifyExample streams={extendedStreams} />
    </div>
  );
};

export default SpotifyExamplePage;
