import { Box, Button, Checkbox } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

const Intro = ({
  beginAudio,
  session,
  setBeginAudio,
  randomizeTopFive,
  setRandomizeTopFive,
}) => {
  if (beginAudio) {
    return null;
  }

  const playHistoryText = session
    ? "Play History"
    : "View Spotify History (without audio)";

  return (
    <Box zIndex={20} backgroundColor="lightgreen" padding={3}>
      Take a trip down memory by listening to your top played songs for each
      month. Logging in with Spotify is required for audio playback.
      {!session && (
        <Button
          mt={4}
          display="block"
          zIndex={20}
          onClick={() => {
            signIn();
          }}
        >
          Login with Spotify
        </Button>
      )}
      <Button
        display="block"
        mt={4}
        zIndex={20}
        colorScheme="teal"
        onClick={() => {
          setBeginAudio(true);
        }}
      >
        {playHistoryText}
      </Button>
      <Box>Options</Box>
      <Checkbox
        checked={randomizeTopFive}
        onChange={() => {
          setRandomizeTopFive(!randomizeTopFive);
        }}
      >
        Randomize Song Played
      </Checkbox>
    </Box>
  );
};

export default Intro;
