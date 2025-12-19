"use client";

import Box from "./Box";
import { FaTrophy } from "react-icons/fa";

const BackburnerCompletedBox = ({ backburnerItems, setBackburnerItems }) => {
  const listItems = backburnerItems.filter((item) => item.is_completed === true);

  const config = {
    title: "Completed Tasks",
    icon: FaTrophy(),
    editable: true,
    sortable: false,
    showTimestamps: false,
    defaultChecked: true,
    action: "saveBackburner",
  };

  return <Box config={config} listItems={listItems} backburnerItems={backburnerItems} setBackburnerItems={setBackburnerItems} />;
};

export default BackburnerCompletedBox;
