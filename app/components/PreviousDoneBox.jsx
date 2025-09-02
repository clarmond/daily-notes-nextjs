import Box from './Box';
import { FaCalendarCheck } from 'react-icons/fa';

const PreviousDoneBox = (props) => {
    const config = {
        title: 'Previous Day\'s Accomplishments and Notes',
        icon: FaCalendarCheck(),
        editable: false,
        sortable: false,
        showTimestamps: true,
        defaultChecked: true,
    };
    const listItems = [];
    return (
        <Box config={config} listItems={listItems} />
    )
}

export default PreviousDoneBox;
