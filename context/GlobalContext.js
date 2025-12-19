"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getTasksByDate, getMostRecentPreviousDate, getMostRecentPreviousDateBefore } from "@/app/actions/tasks";
import dayjs from "dayjs";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [currentItems, setCurrentItems] = useState([]);
  const [previousItems, setPreviousItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [taskType, setTaskType] = useState("regular"); // "regular" or "backburner"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [previousDate, setPreviousDate] = useState(null);

  // Initialize previousDate on mount
  useEffect(() => {
    const initializePreviousDate = async () => {
      const recentDateString = await getMostRecentPreviousDate();
      if (recentDateString) {
        setPreviousDate(new Date(recentDateString));
      }
    };

    initializePreviousDate();
  }, []);

  // Fetch current tasks when selectedDate changes
  useEffect(() => {
    const fetchCurrentTasks = async () => {
      setIsLoaded(false);
      const dateString = dayjs(selectedDate).format('YYYY-MM-DD');
      const tasks = await getTasksByDate(dateString);
      setCurrentItems(tasks);
      setIsLoaded(true);
    };

    fetchCurrentTasks();
  }, [selectedDate]);

  // Fetch previous tasks when previousDate changes
  useEffect(() => {
    if (!previousDate) return;

    const fetchPreviousTasks = async () => {
      const dateString = dayjs(previousDate).format('YYYY-MM-DD');
      const tasks = await getTasksByDate(dateString);
      setPreviousItems(tasks);
    };

    fetchPreviousTasks();
  }, [previousDate]);

  // Auto-update previousDate when selectedDate changes
  useEffect(() => {
    const updatePreviousDate = async () => {
      const dateString = dayjs(selectedDate).format('YYYY-MM-DD');
      const recentDateString = await getMostRecentPreviousDateBefore(dateString);

      if (recentDateString) {
        const newPreviousDate = new Date(recentDateString);
        // Only update if the date actually changed to prevent unnecessary re-renders
        setPreviousDate(prevDate => {
          if (!prevDate || prevDate.getTime() !== newPreviousDate.getTime()) {
            return newPreviousDate;
          }
          return prevDate;
        });
      } else {
        // No tasks found before selected date - set to null
        setPreviousDate(null);
      }
    };

    updatePreviousDate();
  }, [selectedDate]);

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
        taskType,
        setTaskType,
        selectedDate,
        setSelectedDate,
        previousDate,
        setPreviousDate,
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
