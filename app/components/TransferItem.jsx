"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { moveToBackburner, moveToRegular } from "../actions/backburnerTasks";
import { getTasksByDate } from "../actions/tasks";
import { useToast } from "@/context/ToastContext";
import dayjs from "dayjs";
import { useState } from "react";

const TransferItem = ({ id, action, backburnerItems, setBackburnerItems }) => {
  const { currentItems, setCurrentItems, selectedDate } = useGlobalContext();
  const { showToast } = useToast();
  const [isTransferring, setIsTransferring] = useState(false);

  const isBackburner = action === "saveBackburner";

  async function handleTransfer() {
    if (isTransferring) return;

    setIsTransferring(true);

    try {
      if (isBackburner) {
        // Move from backburner to regular tasks
        await moveToRegular(id);

        // Update backburner items state
        const updatedBackburnerItems = backburnerItems.filter(
          (item) => item._id !== id
        );
        setBackburnerItems(updatedBackburnerItems);

        // Refresh current tasks to show the new task
        const dateString = dayjs(selectedDate).format("YYYY-MM-DD");
        const updatedTasks = await getTasksByDate(dateString);
        setCurrentItems(updatedTasks);

        showToast("Task moved to regular tasks", "success");
      } else {
        // Move from regular tasks to backburner
        await moveToBackburner(id);

        // Update current items state
        const updatedCurrentItems = currentItems.filter(
          (item) => item._id !== id
        );
        setCurrentItems(updatedCurrentItems);

        showToast("Task moved to backburner", "success");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      showToast("Failed to transfer task. Please try again.", "error");
    } finally {
      setIsTransferring(false);
    }
  }

  return (
    <div className="align-self-end">
      <button
        aria-label={
          isBackburner
            ? "Move to regular tasks"
            : "Move to backburner"
        }
        className="btn btn-secondary btn-sm"
        onClick={handleTransfer}
        disabled={isTransferring}
        title={isBackburner ? "Move to regular tasks" : "Move to backburner"}
      >
        {isBackburner ? <FaArrowLeft /> : <FaArrowRight />}
      </button>
    </div>
  );
};

export default TransferItem;
