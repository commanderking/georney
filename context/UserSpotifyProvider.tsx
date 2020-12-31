import React, { useState, useMemo } from "react";

export const UserSpotifyContext = React.createContext({
  data: [],
  setData: () => [],
});

export const UserSpotifyProvider = ({ children }) => {
  const [data, setData] = useState([]);

  const value = useMemo(() => {
    return {
      data,
      setData,
    };
  }, [data]);
  return (
    // @ts-ignore
    <UserSpotifyContext.Provider value={value}>
      {children}
    </UserSpotifyContext.Provider>
  );
};

export default UserSpotifyProvider;
