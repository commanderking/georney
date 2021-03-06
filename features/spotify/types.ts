export type RawTrackStream = {
  endTime: string;
  artistName: string;
  trackName: string;
  msPlayed: number;
};

export type TrackStream = {
  // Without an id from spotify data, this is our best attempt for a unique identifier
  trackArtistKey: string;
  endTime: string;
  artistName: string;
  trackName: string;
  msPlayed: number;
};

export type ArtistStream = {
  id: string;
  playCount: number;
  msPlayed: number;
  artistName: string;
  trackNames: Set<string>;
  allStreams: TrackStream[];
};

export type TopArtistStream = ArtistStream & {
  formattedStreams: {
    msPlayed: number;
    // each stream will count once towards streams played in future data
    value: 1;
    date: string;
  }[];
};

export type LegendData = {
  id: string;
  color: string;
  // range might be null if it's the last element in the legend
  range: [number, number | null];
  displayText: string;
};
