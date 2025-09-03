'use server';
import connectDB from '@/config/db';
import Task from '@/models/Task';

import Box from './Box';
import { FaCalendarCheck } from 'react-icons/fa';

const PreviousDoneBox = async (props) => {
    await connectDB();

    const listItems = await Task.find({})
        .limit(5)
        .lean();

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
