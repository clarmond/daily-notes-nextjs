'use client';

import { useGlobalContext } from '@/context/GlobalContext';

import Box from './Box';
import { FaCalendarCheck } from 'react-icons/fa';

const PreviousDoneBox = (props) => {
    const { previousItems } = useGlobalContext();
    const listItems = previousItems;

    const config = {
        title: 'Previous Day\'s Accomplishments and Notes',
        icon: FaCalendarCheck(),
        editable: false,
        sortable: false,
        showTimestamps: true,
        defaultChecked: true,
    };
    return (
        <Box config={config} listItems={listItems} />
    )
}

export default PreviousDoneBox;
