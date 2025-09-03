'use client';

import Box from "./Box";
import { FaList } from 'react-icons/fa';
import { useGlobalContext } from '@/context/GlobalContext';

const TodaysGoalsBox = (props) => {
  const { currentItems } = useGlobalContext();
  const listItems = currentItems.filter(item => item.is_completed === false);
  const config = {
    title: 'Today\'s Tasks and Goals',
    icon: FaList(),
    editable: true,
    sortable: true,
    showTimestamps: false,
    defaultChecked: false,
    action: 'saveNew'
  };
  return (
    <Box config={config} listItems={listItems} />
  )
}

export default TodaysGoalsBox;
