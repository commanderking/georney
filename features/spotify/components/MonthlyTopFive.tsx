import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
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
  const [previewTracks, setPreviewTracks] = useState([]);

  const yearlySongData = getMonthlyStreamingData(streams);

  const [currentIndex, setCurrentIndex] = useState(0);
  const displayDate = yearlySongData[currentIndex].displayDate;

  const currentMonth = yearlySongData[currentIndex];
  const topFive = currentMonth.allTracks.slice(-5).reverse();

  const [audioSrc, setAudioSrc] = useState(null);

  const nextMonth = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const pastMonth = () => {
    setCurrentIndex(currentIndex - 1);
  };

  useEffect(() => {
    const searchQueries = topFive.map((song) => {
      const { artistName, trackName } = song;
      const query = `${trackName}+${artistName}`;

      return query;
    });

    if (token) {
      searchMusic(token, searchQueries).then(
        (results: SpotifySearchResult[]) => {
          const previewTracks = results.map((result) => {
            return getPreviewTrackData(result);
          });
          setPreviewTracks(previewTracks);
          setAudioSrc(previewTracks[0].previewUrl);

          if (beginAudio) {
            const consecutivePlayTimeout = setTimeout(() => {
              setCurrentIndex(currentIndex + 1);
            }, 15000);
          }
        }
      );
    }
  }, [token, currentIndex, beginAudio]);

  console.log({ previewTracks });
  console.log({ audioSrc });

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
              <Box zIndex={20}>
                Login with Spotify is required for audio playback.
                {!session && (
                  <Button
                    zIndex={20}
                    onClick={() => {
                      signIn();
                    }}
                  >
                    Login with Spotify
                  </Button>
                )}
                <Button
                  zIndex={20}
                  onClick={() => {
                    setBeginAudio(true);
                    audioRef && audioRef.current.play();
                  }}
                >
                  {playHistoryText}
                </Button>
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
                <Stack direction="row" spacing={4}>
                  <Stack spacing={0}>
                    <Text>Play Time: </Text>
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
                  return (
                    <Stack
                      key={track.id}
                      mt={2}
                      direction={"row"}
                      spacing={4}
                      align={"center"}
                      minHeight={75}
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
