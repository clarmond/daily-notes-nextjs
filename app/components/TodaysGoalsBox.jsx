import Box from "./Box";
import { FaList } from 'react-icons/fa';

const TodaysGoalsBox = (props) => {
  const config = {
    title: 'Today\'s Tasks and Goals',
    icon: FaList(),
    editable: true,
    sortable: true,
    showTimestamps: false,
    defaultChecked: false,
  };
  const listItems = [];
  return (
    <Box config={config} listItems={listItems} />
  )
}

export default TodaysGoalsBox;
