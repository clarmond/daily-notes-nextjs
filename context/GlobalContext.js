"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getTasksByDate, getMostRecentPreviousDate, getMostRecentPreviousDateBefore } from "@/app/actions/tasks";
import dayjs from "dayjs";
import { useToast } from "@/context/ToastContext";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [currentItems, setCurrentItems] = useState([]);
  const [previousItems, setPreviousItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [taskType, setTaskType] = useState("regular"); // "regular" or "backburner"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [previousDate, setPreviousDate] = useState(null);
  const [lastRefreshDate, setLastRefreshDate] = useState(null);

  const { showToast } = useToast();

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

  // Effect 5: Handle "first focus of the day" auto-refresh
  useEffect(() => {
    const handleFocus = async () => {
      // Get today's date as YYYY-MM-DD string for comparison
      const todayString = dayjs().format('YYYY-MM-DD');
      const selectedDateString = dayjs(selectedDate).format('YYYY-MM-DD');

      // Only proceed if user is viewing today's date
      if (selectedDateString !== todayString) {
        return;
      }

      // Check if we need to refresh (new day since last focus)
      const lastRefreshString = lastRefreshDate
        ? dayjs(lastRefreshDate).format('YYYY-MM-DD')
        : null;

      if (lastRefreshString !== todayString) {
        // It's a new day! Refresh tasks
        setIsLoaded(false);

        try {
          // Fetch current tasks for today
          const currentTasks = await getTasksByDate(todayString);
          setCurrentItems(currentTasks);

          // Fetch updated previous tasks
          const recentDateString = await getMostRecentPreviousDate();
          if (recentDateString) {
            const newPreviousDate = new Date(recentDateString);
            setPreviousDate(newPreviousDate);

            const previousTasks = await getTasksByDate(dayjs(newPreviousDate).format('YYYY-MM-DD'));
            setPreviousItems(previousTasks);
          }

          // Update last refresh date and show notification
          setLastRefreshDate(new Date());
          showToast('Refreshed to today\'s tasks', 'success');
        } catch (error) {
          console.error('Error refreshing tasks on focus:', error);
          showToast('Failed to refresh tasks', 'error');
        } finally {
          setIsLoaded(true);
        }
      }
    };

    // Add event listener
    window.addEventListener('focus', handleFocus);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [selectedDate, lastRefreshDate, showToast, setCurrentItems, setPreviousItems, setIsLoaded, setPreviousDate]);

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
