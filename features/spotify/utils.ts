import {
  RawTrackStream,
  TrackStream,
  ArtistStream,
  TopArtistStream,
  ExtendedStream,
  MonthlyTrackStream,
  MonthlyData,
  SpotifySearchResult,
} from "features/spotify/types";
import _ from "lodash";
import moment from "moment";
import { formatData } from "components/timelineHeatMap/utils";
import scaleCluster from "d3-scale-cluster";
import { redColorScale } from "features/spotify/constants";
import { LegendData } from "features/spotify/types";
import { isArray } from "@material-ui/data-grid";
import { getCalendarMatrix } from "utils/date";

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

const getTrackArtistKey = (trackName: string, artistName: string) => {
  return `${trackName.split(" ").join("_")}_${artistName.split(" ").join("_")}`;
};

export const processInitialData = (trackStreams: RawTrackStream[]) => {
  return trackStreams.map((track) => ({
    ...track,
    id: getTrackArtistKey(track.trackName, track.artistName),
  }));
};

const getTracksByTrackName = (trackStreams: RawTrackStream[]) => {
  const tracksById = _.groupBy(trackStreams, "id");
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
      trackNames: new Set<string>(),
      allStreams: streams,
    }
  );
};

export const getTopArtistStreams = (
  artists: ArtistStream[],
  maxCount: number = 25
) => {
  return artists.slice(0, maxCount).map((artist) => {
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

const getArtistsByMonth = (
  artists: TopArtistStream[],
  startDate: Date,
  endDate: Date
) => {
  const artistsByMonth = artists.map((artist) => {
    return formatData(artist.formattedStreams, {
      startDate,
      endDate,
    });
  });

  return artistsByMonth;
};

// Flattens the values per month for understanding how to quantile the data
const getAllMonthlyValues = (
  artists: TopArtistStream[],
  startDate: Date,
  endDate: Date
) => {
  const artistsByMonth = getArtistsByMonth(artists, startDate, endDate);
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

export const getColorScaler = (
  artists: TopArtistStream[],
  startDate: Date,
  endDate: Date
) => {
  const allMonthlyValues = getAllMonthlyValues(
    artists,
    startDate,
    endDate
  ).filter((value) => value !== 0);

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

export const validateStreamHistoryFiles = (streams: RawTrackStream[]) => {
  if (!isArray(streams)) {
    return false;
  }
  return streams.every((stream) => {
    return Boolean(
      stream.artistName &&
        stream.endTime &&
        stream.trackName &&
        stream.msPlayed >= 0
    );
  });
};

export const convertExtendedStreamToRawStream = (
  extendedStream: ExtendedStream[]
): TrackStream[] => {
  return extendedStream
    .filter(
      (stream) =>
        stream.master_metadata_album_artist_name &&
        stream.master_metadata_track_name
    )
    .map((stream) => {
      const trackName = stream.master_metadata_track_name;
      const artistName = stream.master_metadata_album_artist_name;
      return {
        id: getTrackArtistKey(trackName, artistName),
        // Technically, we should add ms to this for the endtime, but close enough!
        endTime: stream.ts,
        artistName,
        trackName,
        msPlayed: stream.ms_played,
      };
    });
};

export const getStreamsByYear = (streams: TrackStream[]) => {
  return _.groupBy(streams, (stream: TrackStream) => {
    return new Date(stream.endTime).getFullYear();
  });
};

const getStreamingDataByMonthAndId = (streams: TrackStream[]) => {
  const streamsByMonth = _.groupBy(streams, (stream: TrackStream) => {
    const date = new Date(stream.endTime);
    const monthYear = `${date.getFullYear()}-${date.getMonth()}`;

    return monthYear;
  });

  return _.mapValues(streamsByMonth, (streamsByMonthYear) => {
    const byArtistTrackNameStreams = _.groupBy(
      streamsByMonthYear,
      (stream: TrackStream) => stream.id
    );

    const byArtistTrackNameCounts = _.mapValues(
      byArtistTrackNameStreams,
      (streams: TrackStream[]) => {
        const { id, artistName, trackName } = streams[0];

        const totalMsPlayed = streams.reduce((total, currentStream) => {
          return (total += currentStream.msPlayed);
        }, 0);

        return {
          id,
          artistName,
          trackName,
          msPlayed: totalMsPlayed,
          count: streams.length,
          datesPlayed: streams.map((stream) => stream.endTime),
        };
      }
    );

    return byArtistTrackNameCounts;
  });
};

export const formatMilliseconds = (milliseconds: number) => {
  const oneMinute = 1000 * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;
  const duration = moment.duration(milliseconds);

  if (milliseconds > oneDay) {
    return `${duration.days()}d ${duration.hours()}hr`;
  }
  if (milliseconds > oneHour) {
    return `${duration.hours()}hr ${duration.minutes()}min`;
  }
  if (milliseconds > oneMinute) {
    return `${duration.minutes()}min`;
  }
  return `${duration.seconds()}s`;
};

export const getMonthlyStreamingData = (streams: TrackStream[]) => {
  const streamingDatabyMonthAndId = getStreamingDataByMonthAndId(streams);

  const allTracksAndTimePlayed = _.mapValues(
    streamingDatabyMonthAndId,
    (streamsByMonthYear) => {
      const tracks = Object.values(streamsByMonthYear);

      const sortedTracks: MonthlyTrackStream[] = _.sortBy(tracks, [
        "count",
        "msPlayed",
      ]);

      const monthlyData = sortedTracks.reduce(
        (monthlyTotals, currentTrack) => {
          const { allTracks, totalTimePlayed } = monthlyTotals;

          return {
            ...monthlyTotals,
            allTracks: [...allTracks, currentTrack],
            totalTimePlayed: totalTimePlayed + currentTrack.msPlayed,
          };
        },
        {
          allTracks: [],
          totalTimePlayed: 0,
        }
      );

      return monthlyData;
    }
  );

  const monthlyData: MonthlyData[] = [];
  _.each(allTracksAndTimePlayed, (value, key) => {
    const splitDate = key.split("-");
    const displayDate = `${moment(Number(splitDate[1]) + 1, "MM").format(
      "MMMM"
    )} - ${splitDate[0]}`;

    const data: MonthlyData = {
      ...value,
      totalTimePlayed: value.totalTimePlayed,
      totalTimePlayedDisplay: formatMilliseconds(value.totalTimePlayed),
      monthYear: key,
      displayDate,
    };

    monthlyData.push(data);
  });

  return _.sortBy(monthlyData, (data) => {
    // BLAH - hacky way to sort month/year
    const splitMonthYear = data.monthYear.split("-");
    const sortingDate =
      Number(splitMonthYear[0]) * 100 + Number(splitMonthYear[1]);
    return sortingDate;
  });
};

export const getPreviewTrackData = (spotifySearch: SpotifySearchResult) => {
  if (spotifySearch.tracks.items.length === 0) {
    return null;
  }
  const { id, preview_url } = spotifySearch.tracks.items[0];

  return {
    id,
    previewUrl: preview_url,
  };
};

export const getMonthlyMatrixOfDatesPlayed = (
  year: string | number,
  month: string | number,
  datesPlayed: string[] = []
) => {
  const calendarMatrix = getCalendarMatrix(year, month);

  const datesPlayedCounts = datesPlayed.reduce((allDates, currentDate) => {
    const date = new Date(currentDate);
    const day = date.getDate();

    return {
      ...allDates,
      [day]: allDates[day] ? allDates[day] + 1 : 1,
    };
  }, {});

  console.log({ datesPlayedCounts });

  return calendarMatrix.map((week) => {
    return week.map((day) => {
      return {
        day,
        color: datesPlayedCounts[day] ? "lightgreen" : "white",
      };
    });
  });
};
