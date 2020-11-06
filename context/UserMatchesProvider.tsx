import React, { useState, useMemo } from "react";

export const UserMatchesContext = React.createContext({
  data: [],
  setData: () => [],
});

export const UserMatchesProvider = ({ children }) => {
  const [data, setData] = useState([]);

  const value = useMemo(() => {
    return {
      data,
      setData,
    };
  }, [data]);
  return (
    // @ts-ignore
    <UserMatchesContext.Provider value={value}>
      {children}
    </UserMatchesContext.Provider>
  );
};

export default UserMatchesProvider;
