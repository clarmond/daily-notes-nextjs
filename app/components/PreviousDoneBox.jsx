"use client";

import { useGlobalContext } from "@/context/GlobalContext";

import Box from "./Box";
import { FaCalendarCheck } from "react-icons/fa";

const PreviousDoneBox = (props) => {
  const { previousItems, previousDate, setPreviousDate } = useGlobalContext();
  const listItems = previousItems;

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
