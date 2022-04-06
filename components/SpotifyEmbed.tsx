type Props = {
  trackId: string;
};

const SpotifyEmbed = ({ trackId }: Props) => {
  return (
    <iframe
      style={{ transform: "scale(0.75)" }}
      src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
      width="80px"
      height="80px"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    ></iframe>
  );
};

export default SpotifyEmbed;
