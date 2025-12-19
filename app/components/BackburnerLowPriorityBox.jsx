"use client";

import Box from "./Box";
import { FaList } from "react-icons/fa";

const BackburnerLowPriorityBox = ({ backburnerItems, setBackburnerItems }) => {
  const listItems = backburnerItems.filter((item) => item.is_completed === false);

  const config = {
    title: "Low Priority Tasks",
    icon: FaList(),
    editable: true,
    sortable: false,
    showTimestamps: false,
    defaultChecked: false,
    action: "saveBackburner",
  };

  return <Box config={config} listItems={listItems} backburnerItems={backburnerItems} setBackburnerItems={setBackburnerItems} />;
};

export default BackburnerLowPriorityBox;
