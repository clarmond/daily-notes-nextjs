'use client';

import { useState } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { useToast } from '@/context/ToastContext';
import ListItem from "./ListItem";
import ListInput from "./ListInput";
import { updateTaskPriority, getTasksByDate } from '@/app/actions/tasks';
import { FaGripVertical } from "react-icons/fa";
import dayjs from 'dayjs';

const SortableBoxList = (props) => {
  const { isLoaded, selectedDate, setCurrentItems } = useGlobalContext();
  const { showToast } = useToast();
  const { listItems } = props;
  const { editable, defaultChecked, action, showTimestamps } = props.config;
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Set opacity on the parent <li>
    const li = e.currentTarget.closest('li');
    if (li) li.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    const li = e.currentTarget.closest('li');
    if (li) li.style.opacity = '1';
    setDraggedIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }

    try {
      // Reorder the items array
      const reorderedItems = [...listItems];
      const [draggedItem] = reorderedItems.splice(draggedIndex, 1);
      reorderedItems.splice(dropIndex, 0, draggedItem);

      // Update priorities for all items based on new order
      const updatePromises = reorderedItems.map((item, index) =>
        updateTaskPriority(item._id, index)
      );

      await Promise.all(updatePromises);

      // Refresh the task list
      const dateString = dayjs(selectedDate).format('YYYY-MM-DD');
      const updatedTasks = await getTasksByDate(dateString);
      setCurrentItems(updatedTasks);

      showToast('Tasks reordered successfully', 'success');
    } catch (error) {
      console.error('Error reordering tasks:', error);
      showToast('Failed to reorder tasks', 'error');
    }
  };

  if (isLoaded === false) {
    return (
      <div className="font-italic text-center text-muted">Loading...</div>
    );
  }

  return (
    <ul className="list-group">
      {listItems && listItems.length ? (
        listItems.map((item, index) => {
          return (
            <li
              key={item._id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="list-group-item lighter d-flex align-items-center"
            >
              <span
                draggable={true}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                className="flex-shrink-0 me-2 text-muted"
                style={{ cursor: 'grab' }}
                title="Drag to reorder"
              >
                <FaGripVertical />
              </span>
              <div className="flex-grow-1">
                <ListItem
                  id={item._id}
                  text={item.text}
                  defaultChecked={defaultChecked}
                  editable={editable}
                  showTimestamps={showTimestamps}
                  timestamp={item.createdAt}
                  note={item.is_note}
                  noWrapper={true}
                />
              </div>
            </li>
          );
        })
      ) : (
        <div className="box-list-no-items">No items</div>
      )}
      {editable && <ListInput placeholder="Add new item" action={action} />}
    </ul>
  );
};

export default SortableBoxList;
