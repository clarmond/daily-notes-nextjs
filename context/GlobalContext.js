"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentTasks, getPreviousTasks } from "@/app/actions/tasks";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [currentItems, setCurrentItems] = useState([]);
  const [previousItems, setPreviousItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentId, setCurrentId] = useState(0);

  useEffect(() => {
    const currentTasksPromise = getCurrentTasks();
    const previousTasksPromise = getPreviousTasks();
    Promise.allSettled([currentTasksPromise, previousTasksPromise]).then(
      (results) => {
        setCurrentItems(results[0].value);
        setPreviousItems(results[1].value);
        setIsLoaded(true);
      }
    );
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        currentItems,
        setCurrentItems,
        previousItems,
        setPreviousItems,
        isLoaded,
        setIsLoaded,
        currentId,
        setCurrentId,
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
