'use client';

import Box from "./Box";
import { FaTrophy } from "react-icons/fa";
import { useGlobalContext } from '@/context/GlobalContext';

const TodaysDoneBox = (props) => {
    const { currentItems, selectedDate, setSelectedDate } = useGlobalContext();
    const listItems = currentItems.filter(item => item.is_completed === true);
    const config = {
        title: 'Today\'s Accomplishments and Notes',
        icon: FaTrophy(),
        editable: true,
        sortable: false,
        showTimestamps: false,
        defaultChecked: true,
        action: 'saveNote',
        selectedDate: selectedDate,
        onDateChange: setSelectedDate
    }
    return (
        <Box config={config} listItems={listItems} />
    )
}

export default TodaysDoneBox;
