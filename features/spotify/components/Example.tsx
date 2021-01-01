import React, { useMemo } from "react";
import ArtistMonthsHeatMap from "features/spotify/components/ArtistMonthsHeatMap";

import {
  getTrackCounts,
  getStreamsByArtistName,
  getTopArtistStreams,
  getStartAndEndDate,
} from "features/spotify/utils";
import ArtistTable from "features/spotify/components/ArtistTable";
import TrackTable from "features/spotify/components/TrackTable";
import styles from "../styles.module.scss";
import { RawTrackStream } from "features/spotify/types";
type Props = {
  streams: RawTrackStream[];
  /* By default, will use first date in data */
  customStartDate?: Date;
};

export const SpotifyExample = ({ streams, customStartDate }: Props) => {
  const artists = useMemo(
    () => [...getStreamsByArtistName(streams)].slice(0, 100),
    []
  );
  const tracks = [...getTrackCounts(streams)].slice(0, 100);

  const { startDate, endDate } = useMemo(() => getStartAndEndDate(streams), []);

  const topArtistStreams = useMemo(() => getTopArtistStreams(artists, 20), []);

  return (
    <div className={styles.example}>
      <ArtistMonthsHeatMap
        artists={topArtistStreams}
        // temporary - just for current visualization
        startDate={customStartDate || startDate}
        endDate={endDate}
      />
      <ArtistTable data={artists} />
      <TrackTable data={tracks} />
    </div>
  );
};

export default SpotifyExample;
