'use client';

import { useGlobalContext } from '@/context/GlobalContext';
import ListItem from "./ListItem";
import ListInput from "./ListInput";

const BoxList = (props) => {
    const { isLoaded } = useGlobalContext();
    const { listItems } = props;
    const { editable, defaultChecked, action } = props.config;
    if (isLoaded === false) {
        return (
            <div className="text-center">Loading...</div>
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
                            note={item.note}
                        />
                    )
                })
            ) : (
                <div className="box-list-no-items">No items yet</div>
            )}
            {editable && <ListInput placeholder="Add new item" action={action} />}
        </ul>
    )
};

export default BoxList;
