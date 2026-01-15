"use client";

import { useGlobalContext } from "@/context/GlobalContext";

import Box from "./Box";
import { FaCalendarCheck } from "react-icons/fa";

const PreviousDoneBox = (props) => {
  const { previousItems, previousDate, setPreviousDate } = useGlobalContext();

  // If no previous date found, show a message
  if (!previousDate) {
    return (
      <div className="card">
        <div className="card-header">
          <FaCalendarCheck />
          &nbsp;&nbsp;
          Previous Accomplishments and Notes
        </div>
        <div className="card-body text-muted">
          No tasks found before the selected date.
        </div>
      </div>
    );
  }

  // Filter to only show completed tasks
  const listItems = previousItems.filter(item => item.is_completed);

  const config = {
    title: "Previous Accomplishments and Notes",
    icon: FaCalendarCheck(),
    editable: false,
    sortable: false,
    showTimestamps: true,
    defaultChecked: true,
    selectedDate: previousDate,
    onDateChange: setPreviousDate
  };
  return <Box config={config} listItems={listItems} />;
};

export default PreviousDoneBox;
