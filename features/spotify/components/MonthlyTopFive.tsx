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

import { getYearlySongData } from "features/spotify/utils";
import { TrackStream } from "features/spotify/types";
import { formatMilliseconds } from "features/spotify/utils";

type Props = {
  streams: TrackStream[];
};

const MonthlyTopFive = ({ streams }: Props) => {
  const yearlySongData = getYearlySongData(streams);

  const [currentIndex, setCurentIndex] = useState(0);
  const displayDate = yearlySongData[currentIndex].displayDate;

  const currentMonth = yearlySongData[currentIndex];
  const topFive = currentMonth.allTracks.slice(-5).reverse();

  console.log({ topFive });

  console.log({ yearlySongData });
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
          <Box
            h={"210px"}
            bg={"gray.100"}
            mt={-6}
            mx={-6}
            mb={6}
            pos={"relative"}
          >
            {displayDate}
          </Box>
          {/* <Stack>
            <Text
              color={"green.500"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={"sm"}
              letterSpacing={1.1}
            >
              Blog
            </Text>
            <Heading
              color={useColorModeValue("gray.700", "white")}
              fontSize={"2xl"}
              fontFamily={"body"}
            >
              Boost your conversion rate
            </Heading>
            <Text color={"gray.500"}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum.
            </Text>
          </Stack> */}
          {topFive.map((track, index) => {
            console.log({ track });
            return (
              <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
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
