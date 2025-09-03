"use client";

import { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [currentItems, setCurrentItems] = useState([]);
  const [previousItems, setPreviousItems] = useState([]);

  useEffect(() => {
    // set data
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        currentItems,
        previousItems,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// Create a custom hook to access context
export function useGlobalContext() {
  return useContext(GlobalContext);
}
