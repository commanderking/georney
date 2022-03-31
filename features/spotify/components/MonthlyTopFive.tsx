import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";

import { getMonthlyStreamingData } from "features/spotify/utils";
import { TrackStream } from "features/spotify/types";
import { formatMilliseconds } from "features/spotify/utils";

type Props = {
  streams: TrackStream[];
};

const MonthlyTopFive = ({ streams }: Props) => {
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

  return (
    <Box>
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
          <Stack direction="row" spacing={8}>
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
          {topFive.map((track, index) => {
            return (
              <Stack
                key={track.id}
                mt={6}
                direction={"row"}
                spacing={4}
                align={"center"}
              >
                <Text>#{index + 1}</Text>
                <Avatar name={track.artistName} />
                <Stack direction={"column"} spacing={0} fontSize={"sm"}>
                  <Text fontWeight={600}>{track.trackName}</Text>
                  <Text fontWeight={400}>{track.artistName}</Text>
                  <Text color={"gray.500"}>
                    {track.count} plays ({formatMilliseconds(track.msPlayed)})
                  </Text>
                </Stack>
              </Stack>
            );
          })}
        </Box>
      </Center>
    </Box>
  );
};

export default MonthlyTopFive;
