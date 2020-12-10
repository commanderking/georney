import { RawTrackStream, TrackStream } from "features/spotify/types";
import _ from "lodash";
import moment from "moment";

export const getHoursAndMinutes = (milliseconds: number) => {
  const time = moment.duration(milliseconds);

  const dayHours = time.days() * 24;
  return `${dayHours + time.hours()}hr ${time.minutes()}m`;
};

const getTrackArtistKey = (track) => {
  const { trackName, artistName } = track;
  return `${trackName.split(" ").join("_")}_${artistName.split(" ").join("_")}`;
};

const processInitialData = (trackStreams: RawTrackStream[]) => {
  return trackStreams.map((track) => ({
    ...track,
    id: getTrackArtistKey(track),
  }));
};

const getTracksByTrackName = (trackStreams: RawTrackStream[]) => {
  const processedTracks = processInitialData(trackStreams);
  const tracksById = _.groupBy(processedTracks, "id");
  return tracksById;
};

export const getTrackCounts = (trackStreams: RawTrackStream[]) => {
  const trackStreamsByTrackName = getTracksByTrackName(trackStreams);

  const trackStream = _.map(trackStreamsByTrackName, (streams) => {
    return {
      ...streams[0],
      plays: streams.length,
      rawStreams: streams,
    };
  });
  return _.sortBy(trackStream, (track) => track.plays).reverse();
};

const getArtistStreamData = (streams: RawTrackStream[]) => {
  return streams.reduce(
    (compiledStreamData, currentStream) => {
      return {
        ...compiledStreamData,
        plays: compiledStreamData.plays + 1,
        msPlayed: compiledStreamData.msPlayed + currentStream.msPlayed,
        trackNames: compiledStreamData.trackNames.add(currentStream.trackName),
      };
    },
    {
      id: `${streams[0].artistName}`,
      plays: 0,
      msPlayed: 0,
      artistName: streams[0].artistName,
      trackNames: new Set(),
    }
  );
};

export const getStreamsByArtistName = (trackStreams: RawTrackStream[]) => {
  const streamsByArtist = _.groupBy(trackStreams, "artistName");
  const artistStreams = _.map(streamsByArtist, (streams) => {
    return getArtistStreamData(streams);
  });

  return _.sortBy(artistStreams, "msPlayed").reverse();
};
