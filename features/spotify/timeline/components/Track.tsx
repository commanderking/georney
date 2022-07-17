import { Box, Stack, Text, Avatar } from "@chakra-ui/react";
import { formatMilliseconds } from "features/spotify/utils";
import { motion } from "framer-motion";

import { playTime } from "features/spotify/constants";

const Track = ({ track, isCurrentlyPlaying, index, animatePlayTime }) => {
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
        minHeight={55}
        borderRadius={10}
        padding={1}
      >
        <Text>#{index + 1}</Text>
        <Avatar size="sm" name={track.artistName} />
        <Stack direction={"column"} spacing={0} fontSize={"sm"} width="60%">
          <Text fontWeight={600}>
            {track.trackName} - {track.artistName}
          </Text>
          <Text color={"gray.500"}>
            {track.count} plays ({formatMilliseconds(track.msPlayed)})
          </Text>
        </Stack>
      </Stack>
      {isCurrentlyPlaying && (
        <Box
          as={motion.div}
          backgroundColor="black"
          width={0}
          height={1}
          animate={animatePlayTime ? { width: "100%" } : { width: 0 }}
          transition={`${playTime / 1000}s linear`}
        ></Box>
      )}
    </Box>
  );
};

export default Track;
