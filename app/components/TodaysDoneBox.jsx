import Box from "./Box";
import { FaTrophy } from "react-icons/fa";

const TodaysDoneBox = (props) => {
    const config = {
        title: 'Today\'s Accomplishments and Notes',
        icon: FaTrophy(),
        editable: true,
        sortable: false,
        showTimestamps: false,
        defaultChecked: true,
        saveAction: 'new',
    }
    const listItems = [];
    return (
        <Box config={config} listItems={listItems} />
    )
}

export default TodaysDoneBox;
