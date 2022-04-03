import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SpotifyExample from "features/spotify/components/Example";
import streamOne from "data/StreamingHistory0.json";
import streamZero from "data/StreamingHistory1.json";
import extendedHistory0 from "data/extendedHistory/endsong_0.json";
import extendedHistory1 from "data/extendedHistory/endsong_1.json";
import extendedHistory2 from "data/extendedHistory/endsong_2.json";
import {
  processInitialData,
  convertExtendedStreamToRawStream,
} from "features/spotify/utils";
import MonthlyTopFive from "features/spotify/components/MonthlyTopFive";
import { useSession, signIn, signOut } from "next-auth/react";

const getToken = async () => {
  const response = await fetch("/api/spotify/token");
  return await response.json();
};

const SpotifyExamplePage = () => {
  const { data: session } = useSession();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (session && !token) {
      const body = getToken().then((response) => {
        setToken(response.access_token);
      });
    }
  }, [session]);

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

  return (
    <div>
      <MonthlyTopFive streams={extendedStreams} token={token} />

      {!session && (
        <Button
          onClick={() => {
            signIn();
          }}
        >
          Login with Spotify
        </Button>
      )}
      {session && (
        <Button
          onClick={() => {
            signOut();
          }}
        >
          Logout of Spotify
        </Button>
      )}
      <SpotifyExample streams={exampleStreams} />
      <SpotifyExample streams={extendedStreams} />
    </div>
  );
};

export default SpotifyExamplePage;
