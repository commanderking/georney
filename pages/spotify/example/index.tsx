import SpotifyExample from "features/spotify/components/Example";
import streamOne from "data/StreamingHistory0.json";
import streamZero from "data/StreamingHistory1.json";
import extendedHistory0 from "data/extendedHistory/endsong_0.json";
import extendedHistory1 from "data/extendedHistory/endsong_1.json";
import extendedHistory2 from "data/extendedHistory/endsong_2.json";
import {
  processInitialData,
  convertExtendedStreamToRawStream,
  getStreamsByYear,
  getStreamCountsPerMonth,
} from "features/spotify/utils";

const SpotifyExamplePage = () => {
  const exampleStreams = processInitialData([...streamZero, ...streamOne]);

  const extendedStreams = processInitialData(
    convertExtendedStreamToRawStream([
      // @ts-ignore - json file too big so can't tell it's [] and not {} ?
      ...extendedHistory0,
      // @ts-ignore
      ...extendedHistory1,
      // @ts-ignore
      ...extendedHistory2,
    ])
  );

  const byYear = getStreamsByYear(extendedStreams);
  const byMonthYear = getStreamCountsPerMonth(extendedStreams);
  console.log({ byMonthYear });

  return (
    <div>
      <SpotifyExample streams={exampleStreams} />
      <SpotifyExample streams={extendedStreams} />
    </div>
  );
};

export default SpotifyExamplePage;
