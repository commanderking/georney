import { MonthlyTrackStream } from "features/spotify/types";

export const searchTrackByNameAndArtist = async (
  token: string,
  streams: MonthlyTrackStream[]
) => {
  const searchQueries = streams.map((stream: MonthlyTrackStream) => {
    const { artistName, trackName } = stream;
    const query = `${trackName}+${artistName}`;

    return query;
  });

  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
    json: true,
  };

  const urls = searchQueries.map((query) =>
    fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, options)
  );

  const responses = await Promise.all(urls);
  const jsons = await Promise.all(responses.map((response) => response.json()));

  return jsons;
};
