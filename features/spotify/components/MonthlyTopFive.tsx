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

import SpotifyEmbed from "components/SpotifyEmbed";
import { getMonthlyStreamingData } from "features/spotify/utils";
import { TrackStream } from "features/spotify/types";
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
  const [trackIds, setTrackIds] = useState(null);

  const yearlySongData = getMonthlyStreamingData(streams);

  const [currentIndex, setCurrentIndex] = useState(0);
  const displayDate = yearlySongData[currentIndex].displayDate;

  const currentMonth = yearlySongData[currentIndex];
  const topFive = currentMonth.allTracks.slice(-5).reverse();

  const [audioSrc, setAudioSrc] = useState(
    "https://p.scdn.co/mp3-preview/8445d3124130d367c7092eb57fdd984d92b9dcc1?cid=c5a0af91f38c4399a8567fdaa1f23571"
  );

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
      searchMusic(token, searchQueries).then((results) => {
        const trackIds = results.map((result) => {
          return result?.tracks?.items[0]?.id;
        });
        setTrackIds(trackIds);
      });
    }
  }, [token, currentIndex]);

  console.log({ audioRef });

  return (
    <Box>
      <Button
        onClick={() => {
          audioRef && audioRef.current.play();
        }}
      >
        Play
      </Button>
      <Button
        onClick={() => {
          setAudioSrc(null);
          setAudioSrc(
            "https://p.scdn.co/mp3-preview/3e165af7b66b9dfcd5604c204d0ba57453c0a13b?cid=c5a0af91f38c4399a8567fdaa1f23571"
          );
        }}
      >
        Change songs
      </Button>
      <Button
        onClick={() => {
          setTrackIds(null);
          nextMonth();
        }}
      >
        Next
      </Button>
      <audio ref={audioRef} src={audioSrc} autoPlay></audio>
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
              <Text fontWeight={800}>{currentMonth.allTracks.length}</Text>
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
                    {track.count} plays ({formatMilliseconds(track.msPlayed)})
                  </Text>
                </Stack>
                <Box>
                  {trackIds && <SpotifyEmbed trackId={trackIds[index]} />}
                </Box>
              </Stack>
            );
          })}
        </Box>
      </Center>
    </Box>
  );
};

export default MonthlyTopFive;
