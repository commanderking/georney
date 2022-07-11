import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  Checkbox,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";

import {
  getMonthlyStreamingData,
  getPreviewTrackData,
  getMonthlyMatrixOfDatesPlayed,
} from "features/spotify/utils";
import { TrackStream, SpotifySearchResult } from "features/spotify/types";
import { formatMilliseconds } from "features/spotify/utils";
import Calendar from "components/Calendar";

import { initialSongIndex } from "features/spotify/constants";

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
  const yearlySongData = getMonthlyStreamingData(streams);

  const [currentIndex, setCurrentIndex] = useState(initialSongIndex);

  const currentMonthTrackData = yearlySongData[currentIndex];
  const displayDate = currentMonthTrackData.displayDate;
  const topFive = currentMonthTrackData.allTracks.slice(-5).reverse();
  const [year, month] = currentMonthTrackData.monthYear.split("-");

  const audioRef = useRef<HTMLAudioElement>();
  const { data: session } = useSession();

  const [beginAudio, setBeginAudio] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(null);

  const [randomizeTopFive, setRandomizeTopFive] = useState(false);

  const currentSong = topFive[currentlyPlayingIndex];

  console.log({ currentSong });

  const calendarData = getMonthlyMatrixOfDatesPlayed(
    year,
    month,
    currentSong?.datesPlayed || []
  );

  console.log({ calendarData });

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

            validIndex = previewTracks[randomIndex]?.previewUrl
              ? randomIndex
              : null;
          }
          if (!validIndex) {
            validIndex = previewTracks.findIndex((previewTrack) =>
              Boolean(previewTrack?.previewUrl)
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
        <audio
          ref={audioRef}
          src={beginAudio ? audioSrc : ""}
          autoPlay={audioSrc ? true : false}
        ></audio>
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
                Take a trip down memory by listening to your top played songs
                for each month. Logging in with Spotify is required for audio
                playback.
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
            )}

            {
              <Box
                opacity={beginAudio ? 1 : 0.3}
                filter={beginAudio ? "" : "blur(0.2rem)"}
              >
                <Box bg={"gray.100"} mt={-6} mx={-6} mb={6}>
                  <Box textAlign="center">
                    <Heading size="lg">{displayDate}</Heading>
                    <Box p={2} display="inline-block">
                      <Calendar
                        data={calendarData}
                        onlyShowDatesInMonth={true}
                      />
                    </Box>
                  </Box>
                </Box>
                <Stack direction="row" spacing={8}>
                  <Stack spacing={0}>
                    <Text>Monthly Play Time </Text>
                    <Text fontWeight={800}>
                      {currentMonthTrackData.totalTimePlayedDisplay}
                    </Text>
                  </Stack>
                  <Stack spacing={0}>
                    <Text> # Unique Songs</Text>
                    <Text fontWeight={800}>
                      {currentMonthTrackData.allTracks.length}
                    </Text>
                  </Stack>
                </Stack>
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
                        mt={0}
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
                          <Text fontWeight={600}>
                            {track.trackName} - {track.artistName}
                          </Text>
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
                          transition={`${playTime / 1000}s linear`}
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
