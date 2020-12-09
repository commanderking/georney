import { RawTrackStream, TrackStream } from "features/spotify/types";
import _ from "lodash";

export const targetStructure = {
  byArtist: {
    artist_name: {
      totalMs: 10000,
      rawData: [],
    },
  },
  bySong: {
    // append artist_name to guarantee uniqueness as much as possible
    song_name_artist_name: {
      totalMs: 20000,
      rawData: [],
    },
  },
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
  const tracksByArtist = _.groupBy(processedTracks, "id");
  return tracksByArtist;
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
