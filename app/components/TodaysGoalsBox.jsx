"use client";

import Box from "./Box";
import { FaList, FaCopy } from "react-icons/fa";
import { useGlobalContext } from "@/context/GlobalContext";
import { useToast } from "@/context/ToastContext";
import { saveNewTask, getTasksByDate } from "@/app/actions/tasks";
import { useState } from "react";
import dayjs from "dayjs";

const TodaysGoalsBox = (props) => {
  const {
    currentItems,
    previousItems,
    selectedDate,
    setSelectedDate,
    setCurrentItems,
  } = useGlobalContext();
  const { showToast } = useToast();
  const [isCopying, setIsCopying] = useState(false);

  const listItems = currentItems.filter((item) => item.is_completed === false);

  const handleCopyUnfinishedTasks = async () => {
    setIsCopying(true);

    try {
      // Filter unfinished tasks from previous day
      const unfinishedTasks = previousItems.filter(
        (item) => item.is_completed === false && !item.is_note
      );

      if (unfinishedTasks.length === 0) {
        showToast("No unfinished tasks to copy from the previous day.", "info");
        setIsCopying(false);
        return;
      }

      // Copy each unfinished task to today
      for (const task of unfinishedTasks) {
        await saveNewTask(task.text, false, false);
      }

      // Refresh current tasks
      const dateString = dayjs(selectedDate).format("YYYY-MM-DD");
      const updatedTasks = await getTasksByDate(dateString);
      setCurrentItems(updatedTasks);

      showToast(`${unfinishedTasks.length} task(s) copied successfully!`, "success");
    } catch (error) {
      console.error("Error copying tasks:", error);
      showToast("Failed to copy tasks. Please try again.", "error");
    } finally {
      setIsCopying(false);
    }
  };

  const config = {
    title: "Today's Tasks and Goals",
    icon: FaList(),
    editable: true,
    sortable: true,
    showTimestamps: false,
    defaultChecked: false,
    action: "saveNew",
    selectedDate: selectedDate,
    onDateChange: setSelectedDate,
  };

  return (
    <>
      <div className="mb-2 d-flex justify-content-start">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={handleCopyUnfinishedTasks}
          disabled={isCopying || previousItems.length === 0}
          title="Copy unfinished tasks from previous day"
        >
          <FaCopy />{" "}
          {isCopying ? "Copying..." : "Copy Previous Unfinished Tasks"}
        </button>
      </div>
      <Box config={config} listItems={listItems} />
    </>
  );
};

export default TodaysGoalsBox;
