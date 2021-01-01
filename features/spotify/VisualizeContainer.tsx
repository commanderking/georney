import React, { useContext } from "react";
import { GlobalContext } from "context/GlobalProvider";
import Example from "features/spotify/components/Example";

const VisualizeContainer = () => {
  const { userSpotifyData, setUserSpotifyData } = useContext(GlobalContext);

  return (
    <div>{userSpotifyData.length && <Example streams={userSpotifyData} />}</div>
  );
};

export default VisualizeContainer;
