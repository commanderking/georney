import React, { useState, useMemo } from "react";

export const GlobalContext = React.createContext({
  userSpotifyData: [],
  setUserSpotifyData: () => [],
});

export const GlobalProvider = ({ children }) => {
  const [userSpotifyData, setUserSpotifyData] = useState([]);

  const value = useMemo(() => {
    return {
      userSpotifyData,
      setUserSpotifyData,
    };
  }, [userSpotifyData]);
  return (
    // @ts-ignore
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default GlobalProvider;
