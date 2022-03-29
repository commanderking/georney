export type RawTrackStream = {
  endTime: string;
  artistName: string;
  trackName: string;
  msPlayed: number;
};

export type TrackStream = {
  // Without an id from spotify data, this is our best attempt for a unique identifier
  id: string;
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
  allStreams: RawTrackStream[];
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

// Streaming data form from extended streaming history data request
export type ExtendedStream = {
  conn_country: string;
  episode_name: string | null;
  episode_show_name: string | null;
  incognito_mode: boolean;
  ip_addr_decrypted: string;
  master_metadata_album_album_name: string;
  master_metadata_album_artist_name: string;
  master_metadata_track_name: string;
  ms_played: number;
  offline: boolean;
  offline_timestamp: number;
  platform: string;
  // Figure out what the enum reasons for better typing
  reason_end: string;
  reason_start: string;
  shuffle: boolean;
  skipped: boolean | null;
  spotify_episode_uri: string | null;
  spotify_track_uri: string;
  ts: string;
  user_agent_decrypted: string;
  username: string;
};
