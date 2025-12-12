'use client';

import BoxList from "./BoxList";
import dayjs from "dayjs";

const Box = (props) => {
  const { icon, title, selectedDate, onDateChange } = props.config;

  const handleDateChange = (e) => {
    if (onDateChange) {
      const newDate = new Date(e.target.value);
      onDateChange(newDate);
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          {icon}
          &nbsp;
          &nbsp;
          {title}
        </div>
        {selectedDate && onDateChange && (
          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: 'auto' }}
            value={dayjs(selectedDate).format('YYYY-MM-DD')}
            onChange={handleDateChange}
          />
        )}
      </div>
      <div className="card-body">
        <BoxList {...props} />
      </div>
    </div>
  )
};

export default Box;
