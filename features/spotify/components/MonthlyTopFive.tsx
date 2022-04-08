import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  Progress,
  useColorModeValue,
  Checkbox,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import {
  getMonthlyStreamingData,
  getPreviewTrackData,
} from "features/spotify/utils";
import { TrackStream, SpotifySearchResult } from "features/spotify/types";
import { formatMilliseconds } from "features/spotify/utils";

type Props = {
  streams: TrackStream[];
  token: string | null;
};

const playTime = 15000;

const searchMusic = async (token: string, searchQueries: string[]) => {
  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
    json: true,
  };

  const urls = searchQueries.map((query) =>
    fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, options)
  );

  const responses = await Promise.all(urls);
  const jsons = await Promise.all(responses.map((response) => response.json()));

  return jsons;
};

const MonthlyTopFive = ({ streams, token }: Props) => {
  const audioRef = useRef<HTMLAudioElement>();
  const { data: session } = useSession();

  const [beginAudio, setBeginAudio] = useState(false);

  const yearlySongData = getMonthlyStreamingData(streams);

  const [currentIndex, setCurrentIndex] = useState(0);
  const displayDate = yearlySongData[currentIndex].displayDate;

  const currentMonth = yearlySongData[currentIndex];
  const topFive = currentMonth.allTracks.slice(-5).reverse();

  const [audioSrc, setAudioSrc] = useState(null);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(null);

  const [randomizeTopFive, setRandomizeTopFive] = useState(false);

  useEffect(() => {
    const searchQueries = topFive.map((song) => {
      const { artistName, trackName } = song;
      const query = `${trackName}+${artistName}`;

      return query;
    });

    if (token) {
      searchMusic(token, searchQueries).then(
        (results: SpotifySearchResult[]) => {
          setCurrentlyPlayingIndex(null);
          const previewTracks = results.map((result) => {
            return getPreviewTrackData(result);
          });

          let validIndex = null;
          if (randomizeTopFive) {
            const randomIndex = Math.round(
              Math.random() * (previewTracks.length - 1)
            );

            console.log({ randomIndex });
            validIndex = previewTracks[randomIndex]?.previewUrl
              ? randomIndex
              : null;
          }
          if (!validIndex) {
            validIndex = previewTracks.findIndex((previewTrack) =>
              Boolean(previewTrack.previewUrl)
            );
          }

          const previewUrl = validIndex > -1 && previewTracks[validIndex];
          if (previewUrl) {
            setAudioSrc(previewTracks[validIndex].previewUrl);
          }

          setCurrentlyPlayingIndex(validIndex);

          if (beginAudio) {
            const consecutivePlayTimeout = setTimeout(() => {
              setCurrentIndex(currentIndex + 1);
            }, playTime);

            return () => clearInterval(consecutivePlayTimeout);
          }
        }
      );
    }
  }, [token, currentIndex, beginAudio]);

  const playHistoryText = session
    ? "Play History"
    : "View Spotify History (without audio)";

  return (
    <Box>
      <Box>
        <audio ref={audioRef} src={beginAudio && audioSrc} autoPlay></audio>
        <Center py={6}>
          <Box
            maxW={"445px"}
            w={"full"}
            bg={useColorModeValue("white", "gray.900")}
            boxShadow={"2xl"}
            rounded={"md"}
            p={6}
            overflow={"hidden"}
          >
            {!beginAudio && (
              <Box zIndex={20} backgroundColor="lightgreen" padding={3}>
                Take a trip down memory lane with your top songs played for each
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
                    audioRef && audioRef.current.play();
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
            )}

            {
              <Box
                opacity={beginAudio ? 1 : 0.3}
                filter={beginAudio ? "" : "blur(0.2rem)"}
              >
                <Box h={"100px"} bg={"gray.100"} mt={-6} mx={-6} mb={6}>
                  <Heading textAlign="center">{displayDate}</Heading>
                </Box>
                <Stack direction="row" spacing={8}>
                  <Stack spacing={0}>
                    <Text>Monthly Play Time </Text>
                    <Text fontWeight={800}>
                      {currentMonth.totalTimePlayedDisplay}
                    </Text>
                  </Stack>
                  <Stack spacing={0}>
                    <Text> # Unique Songs</Text>
                    <Text fontWeight={800}>
                      {currentMonth.allTracks.length}
                    </Text>
                  </Stack>
                </Stack>
                <Stack></Stack>
                {topFive.map((track, index) => {
                  const isCurrentlyPlaying = index === currentlyPlayingIndex;
                  return (
                    <Box
                      key={track.id}
                      backgroundColor={isCurrentlyPlaying ? "lightgreen" : ""}
                    >
                      <Stack
                        as={motion.div}
                        opacity={0}
                        animate={{ opacity: 1 }}
                        transition="1s linear"
                        key={track.id}
                        mt={2}
                        direction={"row"}
                        spacing={4}
                        align={"center"}
                        minHeight={75}
                        borderRadius={10}
                        padding={2}
                      >
                        <Text>#{index + 1}</Text>
                        <Avatar name={track.artistName} />
                        <Stack
                          direction={"column"}
                          spacing={0}
                          fontSize={"sm"}
                          width="60%"
                        >
                          <Text fontWeight={600}>{track.trackName}</Text>
                          <Text fontWeight={400}>{track.artistName}</Text>
                          <Text color={"gray.500"}>
                            {track.count} plays (
                            {formatMilliseconds(track.msPlayed)})
                          </Text>
                        </Stack>
                      </Stack>
                      {isCurrentlyPlaying && (
                        <Box
                          as={motion.div}
                          backgroundColor="black"
                          width={0}
                          height={1}
                          animate={
                            beginAudio && currentlyPlayingIndex !== null
                              ? { width: "100%" }
                              : { width: 0 }
                          }
                          transition="14.7s linear"
                          // transition={{ ease: "easeOut", duration: 2 }}
                        ></Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            }
          </Box>
        </Center>
      </Box>
    </Box>
  );
};

export default MonthlyTopFive;
