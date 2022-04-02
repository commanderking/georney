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
import { useState, useEffect } from "react";

import { getMonthlyStreamingData } from "features/spotify/utils";
import { TrackStream } from "features/spotify/types";
import { formatMilliseconds } from "features/spotify/utils";

type Props = {
  streams: TrackStream[];
  token: string | null;
};

const searchMusic = async (token: string, searchQueries: string[]) => {
  var options = {
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

  console.log({ jsons });

  return jsons;
};

const MonthlyTopFive = ({ streams, token }: Props) => {
  const [trackIds, setTrackIds] = useState(null);

  const yearlySongData = getMonthlyStreamingData(streams);

  const [currentIndex, setCurrentIndex] = useState(0);
  const displayDate = yearlySongData[currentIndex].displayDate;

  const currentMonth = yearlySongData[currentIndex];
  const topFive = currentMonth.allTracks.slice(-5).reverse();

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

  console.log({ trackIds });

  return (
    <Box>
      <Button
        onClick={() => {
          setTrackIds(null);
          nextMonth();
        }}
      >
        Next
      </Button>
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
                {/* <Avatar name={track.artistName} /> */}
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
                  {trackIds && (
                    <iframe
                      style={{ transform: "scale(0.75)" }}
                      src={`https://open.spotify.com/embed/track/${trackIds[index]}?utm_source=generator`}
                      width="80px"
                      height="80px"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    ></iframe>
                  )}
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
