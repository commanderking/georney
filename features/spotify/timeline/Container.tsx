import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  getMonthlyStreamingData,
  getPreviewTrackData,
  getMonthlyMatrixOfDatesPlayed,
} from "features/spotify/utils";
import { TrackStream, SpotifySearchResult } from "features/spotify/types";
import Calendar from "components/Calendar";

import {
  initialSongIndex,
  topXSongs,
  playTime,
} from "features/spotify/constants";
import Track from "features/spotify/timeline/components/Track";
import Intro from "features/spotify/timeline/components/Intro";
import { searchTrackByNameAndArtist } from "features/spotify/requests";

type Props = {
  streams: TrackStream[];
  token: string | null;
};

const MonthlyTopFive = ({ streams, token }: Props) => {
  const yearlySongData = getMonthlyStreamingData(streams);

  const [currentIndex, setCurrentIndex] = useState(initialSongIndex);

  const currentMonthTrackData = yearlySongData[currentIndex];
  const displayDate = currentMonthTrackData.displayDate;
  const topFive = currentMonthTrackData.allTracks.slice(-topXSongs).reverse();
  const [year, month] = currentMonthTrackData.monthYear.split("-");

  const audioRef = useRef<HTMLAudioElement>();
  const { data: session } = useSession();

  const [beginAudio, setBeginAudio] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(null);

  const [randomizeTopFive, setRandomizeTopFive] = useState(false);

  const currentSong = topFive[currentlyPlayingIndex];

  const calendarData = getMonthlyMatrixOfDatesPlayed(
    year,
    month,
    currentSong?.datesPlayed || []
  );

  useEffect(() => {
    if (token) {
      searchTrackByNameAndArtist(token, topFive).then(
        (results: SpotifySearchResult[]) => {
          setCurrentlyPlayingIndex(null);
          const previewTracks = results.map((result) =>
            getPreviewTrackData(result)
          );

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

  const animatePlayTime = beginAudio && currentlyPlayingIndex !== null;

  return (
    <Box>
      <audio
        ref={audioRef}
        src={beginAudio ? audioSrc : ""}
        autoPlay={audioSrc ? true : false}
        loop
      />
      <Box maxW="445px" margin="auto">
        <Intro
          beginAudio={beginAudio}
          session={session}
          setBeginAudio={setBeginAudio}
          randomizeTopFive={randomizeTopFive}
          setRandomizeTopFive={setRandomizeTopFive}
        />
      </Box>
      <Center py={6}>
        <Box
          maxW={"445px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          rounded={"md"}
          overflow={"hidden"}
          border="1px solid lightgray"
        >
          <Box
            opacity={beginAudio ? 1 : 0.3}
            filter={beginAudio ? "" : "blur(0.2rem)"}
            p={5}
          >
            <Center>
              <Heading p={2} size="lg">
                {displayDate}
              </Heading>
            </Center>
            <Box m={2}>
              {topFive.map((track, index) => {
                return (
                  <Track
                    track={track}
                    isCurrentlyPlaying={index === currentlyPlayingIndex}
                    index={index}
                    animatePlayTime={animatePlayTime}
                  />
                );
              })}
            </Box>
          </Box>
          <Box bg={"gray.100"} p={4} textAlign="center">
            <Box p={2} display="inline-block">
              <Calendar data={calendarData} onlyShowDatesInMonth={true} />
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
          </Box>
        </Box>
      </Center>
    </Box>
  );
};

export default MonthlyTopFive;
