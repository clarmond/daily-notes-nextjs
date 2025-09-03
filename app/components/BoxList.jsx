import ListItem from "./ListItem";
import ListInput from "./ListInput";

const BoxList = (props) => {
    const { listItems } = props;
    const { editable, defaultChecked, action } = props.config;
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
