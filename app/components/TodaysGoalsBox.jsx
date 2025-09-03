import Box from "./Box";
import { FaList } from 'react-icons/fa';
// import { useState } from "react";

const TodaysGoalsBox = (props) => {
  // const [listItems, setListItems] = useState([]);
  const config = {
    title: 'Today\'s Tasks and Goals',
    icon: FaList(),
    editable: true,
    sortable: true,
    showTimestamps: false,
    defaultChecked: false,
    action: 'saveNew'
  };
  const listItems = [];
  return (
    <Box config={config} listItems={listItems} />
  )
}

export default TodaysGoalsBox;
