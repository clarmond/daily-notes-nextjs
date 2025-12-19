'use client';

import { useGlobalContext } from '@/context/GlobalContext';
import ListItem from "./ListItem";
import ListInput from "./ListInput";

const BoxList = (props) => {
    const { isLoaded } = useGlobalContext();
    const { listItems, backburnerItems, setBackburnerItems } = props;
    const { editable, defaultChecked, action, showTimestamps } = props.config;
    if (isLoaded === false && !backburnerItems) {
        return (
            <div className="font-italic text-center text-muted">Loading...</div>
        )
    }
    return (
        <ul className="list-group">
            {listItems && listItems.length ? (
                listItems.map((item) => {
                    return (
                        <ListItem
                            key={item._id}
                            id={item._id}
                            text={item.text}
                            defaultChecked={defaultChecked}
                            editable={editable}
                            showTimestamps={showTimestamps}
                            timestamp={item.createdAt}
                            note={item.is_note}
                            backburnerItems={backburnerItems}
                            setBackburnerItems={setBackburnerItems}
                            action={action}
                        />
                    )
                })
            ) : (
                <div className="box-list-no-items">No items</div>
            )}
            {editable && <ListInput placeholder="Add new item" action={action} backburnerItems={backburnerItems} setBackburnerItems={setBackburnerItems} />}
        </ul>
    )
};

export default BoxList;
