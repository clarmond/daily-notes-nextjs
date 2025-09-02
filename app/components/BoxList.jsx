'use client';

import ListItem from "./ListItem";
import ListInput from "./ListInput";

const BoxList = (props) => {
    const { listItems } = props;
    const { editable, defaultChecked, newItemHandler } = props.config;
    return (
        <ul className="list-group">
            {listItems && listItems.length ? (
                listItems.map((item) => {
                    return (
                        <ListItem
                            key={item.id}
                            id={item.id}
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
            {editable && <ListInput newItemHandler={newItemHandler} placeholder="Add new item" />}
        </ul>
    )
};

export default BoxList;
