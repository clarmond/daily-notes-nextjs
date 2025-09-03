"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getPreviousTasks } from "@/app/actions/tasks";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [currentItems, setCurrentItems] = useState([]);
  const [previousItems, setPreviousItems] = useState([]);

  useEffect(() => {
    getPreviousTasks().then((items) => setPreviousItems(items));
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        currentItems,
        setCurrentItems,
        previousItems,
        setPreviousItems,
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
