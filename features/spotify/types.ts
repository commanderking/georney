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

export type MonthlyTrackStream = {
  id: string;
  artistName: string;
  trackName: string;
  msPlayed: number;
  count: number;
  datesPlayed: string[];
};

export type MonthlyData = {
  totalTimePlayed: number;
  totalTimePlayedDisplay: string;
  monthYear: string;
  displayDate: string;
  allTracks: MonthlyTrackStream[];
};

export type SpotifySearchResult = {
  tracks: {
    href: string; // "https://api.spotify.com/v1/search?query=%E6%98%9F%E6%99%B4+Jay+Chou&type=track&locale=en-US%2Cen%3Bq%3D0.9&offset=0&limit=20",
    items: {
      album: {
        album_type: string; // album
        artists: {
          external_urls: {
            spotify: string; // "https://open.spotify.com/artist/2elBjNSdBE2Y3f0j1mjrql"
          };
          href: string; // "https://api.spotify.com/v1/artists/2elBjNSdBE2Y3f0j1mjrql"
          id: string; //  "2elBjNSdBE2Y3f0j1mjrql"
          name: string; // Jay Chou
          type: string; // artist
          uri: string; // spotify:artist:2elBjNSdBE2Y3f0j1mjrql
        }[];
        available_markets: []; // ["AD, "AE" ...],
        external_urls: {
          spotify: string; //https://open.spotify.com/album/0yS6jOCvKaY6KfJ1Cpc7FZ
        };
        href: string; // https://api.spotify.com/v1/albums/0yS6jOCvKaY6KfJ1Cpc7FZ
        id;
        string; // 0yS6jOCvKaY6KfJ1Cpc7FZ,
        images: {
          height: number;
          url: string;
          width: number;
        }[];
        name: string; // 杰倫,
        release_date: string; // 2000-11-06
        release_date_precision: string; // day
        total_tracks: number;
        type: string; // album
        uri: string; //spotify:album:0yS6jOCvKaY6KfJ1Cpc7FZ
      };
      artists: {
        external_urls: {
          spotify: string; // https://open.spotify.com/artist/2elBjNSdBE2Y3f0j1mjrql
        };
        href: string;
        id: string;
        name: string;
        type: string; // artist
        uri: string;
      }[];
      available_markets: string[];
      disc_number: number;
      duration_ms: number;
      explicit: boolean;
      external_ids: {
        isrc: string; // TWK970000103
      };
      external_urls: {
        spotify: string;
      }[];
      href: string;
      id: string;
      is_local: boolean;
      name: string;
      popularity: number;
      preview_url: string;
      track_number: number;
      type: string; // track
      uri: string; // string
    }[];
  };
};

type FormattedSpotifyTrack = {
  spotifyId: string;
  previewUrl: string | null;
} | null;

export type TopTrack = MonthlyTrackStream & FormattedSpotifyTrack;

export type ArtistCount = {
  artistName: string;
  msPlayed: number;
  count: number;
};
