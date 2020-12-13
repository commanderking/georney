import {
  RawTrackStream,
  ArtistStream,
  TopArtistStream,
} from "features/spotify/types";
import _ from "lodash";
import moment from "moment";
import { formatData } from "components/timelineHeatMap/utils";
import scaleCluster from "d3-scale-cluster";
import { redColorScale } from "features/spotify/constants";
import { LegendData } from "features/spotify/types";

export const getHoursAndMinutes = (milliseconds: number) => {
  const time = moment.duration(milliseconds);

  const dayHours = time.days() * 24;
  return `${dayHours + time.hours()}hr ${time.minutes()}m`;
};

const getStreamDate = (stream: RawTrackStream) => {
  // streamDate format "2020-08-12 03:01" - but safari doesn't like new Date on this,
  // chrome and firefox can handle it
  return new Date(stream.endTime.split(" ")[0]);
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
      playCount: streams.length,
      rawStreams: streams,
    };
  });
  return _.sortBy(trackStream, (track) => track.playCount).reverse();
};

const getArtistStreamData = (streams: RawTrackStream[]) => {
  return streams.reduce(
    (compiledStreamData, currentStream) => {
      return {
        ...compiledStreamData,
        playCount: compiledStreamData.playCount + 1,
        msPlayed: compiledStreamData.msPlayed + currentStream.msPlayed,
        trackNames: compiledStreamData.trackNames.add(currentStream.trackName),
      };
    },
    {
      id: `${streams[0].artistName}`,
      playCount: 0,
      msPlayed: 0,
      artistName: streams[0].artistName,
      trackNames: new Set(),
      allStreams: streams,
    }
  );
};

export const getTopArtistStreams = (artists: ArtistStream[]) => {
  return artists.slice(0, 49).map((artist) => {
    return {
      ...artist,
      formattedStreams: artist.allStreams.map((stream) => ({
        msPlayed: stream.msPlayed,
        // each stream will count once towards streams played in future data
        value: 1,
        date: getStreamDate(stream),
      })),
    };
  });
};

export const getStreamsByArtistName = (trackStreams: RawTrackStream[]) => {
  const streamsByArtist = _.groupBy(trackStreams, "artistName");
  const artistStreams = _.map(streamsByArtist, (streams) => {
    return getArtistStreamData(streams);
  });

  const sortedArtistStreams = [...artistStreams].sort(
    (streamA, streamB) => streamB.playCount - streamA.playCount
  );

  return sortedArtistStreams;
};

const getArtistsByMonth = (artists: TopArtistStream[]) => {
  const artistsByMonth = artists.map((artist) => {
    return formatData(artist.formattedStreams, {
      startDate: new Date("2020-01-01"),
      endDate: new Date("2020-12-31"),
    });
  });

  return artistsByMonth;
};

// Flattens the values per month for understanding how to quantile the data
const getAllMonthlyValues = (artists: TopArtistStream[]) => {
  const artistsByMonth = getArtistsByMonth(artists);
  const initialValues: number[] = [];
  const allArtistsMonthlyStats = artistsByMonth.map((months) => {
    return months.reduce((allValues, currentMonth) => {
      return [...allValues, currentMonth.value];
    }, initialValues);
  });

  return _.flatten(allArtistsMonthlyStats);
};

// This was an attempt to setup scaleQuantile with mapping values to different quantiles
// Use - return scaleQuantile().domain(allMonthlyValues).range(getColorRange());
// export const getColorRange = () => {
//   // We're going to use 100
//   const lightPink = _.times(25, _.constant("#F6BDC0"));
//   const darkerPink = _.times(25, _.constant("#F07470"));
//   const red = _.times(25, _.constant("#DC1C13"));
//   const maroon = _.times(15, _.constant("#9A140D"));
//   const darkMaroon = _.times(9, _.constant("#580B08"));
//   const black = ["black"];

//   console.log("lightPink", lightPink);
//   return [
//     ...lightPink,
//     ...darkerPink,
//     ...red,
//     ...maroon,
//     ...darkMaroon,
//     ...black,
//   ];
//   // This would return even quantiles
//   // return ["#F6BDC0", "#F07470", "#DC1C13", "#9A140D", "#580B08", "black"];
// };

export const getColorScaler = (artists: TopArtistStream[]) => {
  const allMonthlyValues = getAllMonthlyValues(artists).filter(
    (value) => value !== 0
  );

  // color scheme from - https://www.schemecolor.com/sample?getcolor=dc1c13
  return scaleCluster().domain(allMonthlyValues).range(redColorScale);
};

export const getStartAndEndDate = (streams: RawTrackStream[]) => {
  const streamsOrderedByEndTime = _.sortBy(streams, "endTime");

  return {
    startDate: getStreamDate(_.first(streamsOrderedByEndTime)),
    endDate: getStreamDate(_.last(streamsOrderedByEndTime)),
  };
};

const getMaxRange = (clusters, index) => {
  if (index + 1 === clusters.length) {
    return null;
  }
  // -1 since we don't want to include first number of next cluster
  return clusters[index + 1] - 1;
};

const getDisplayText = (min, max) => {
  if (!max) {
    return `${min}+`;
  }
  return `${min} - ${max}`;
};

export const getClustersLegendData = (
  colors: string[],
  clusters: number[]
): LegendData[] => {
  return colors.map((color, index) => {
    const min = clusters[index];
    const max = getMaxRange(clusters, index);
    return {
      id: `legend-${color}-${index}`,
      color,
      range: [min, max],
      displayText: getDisplayText(min, max),
    };
  });
};
