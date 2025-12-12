'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import LoginBox from "../components/LoginBox";
import { getCompletedTasksByMonth } from '../actions/tasks';

export default function Reports() {
  const { data: session } = useSession();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate default month based on current day
  useEffect(() => {
    const today = dayjs();
    const dayOfMonth = today.date();

    // If day < 5, use previous month, otherwise use current month
    const defaultMonth = dayOfMonth < 5
      ? today.subtract(1, 'month').format('YYYY-MM')
      : today.format('YYYY-MM');

    setSelectedMonth(defaultMonth);
  }, []);

  // Fetch tasks when month changes
  useEffect(() => {
    if (!selectedMonth || !session) return;

    const fetchTasks = async () => {
      setIsLoading(true);
      const [year, month] = selectedMonth.split('-');
      const completedTasks = await getCompletedTasksByMonth(parseInt(year), parseInt(month));
      setTasks(completedTasks);
      setIsLoading(false);
    };

    fetchTasks();
  }, [selectedMonth, session]);

  if (!session) {
    return <LoginBox />;
  }

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = dayjs(task.createdAt).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {});

  const sortedDates = Object.keys(tasksByDate).sort();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Monthly Accomplishments Report</h2>
            <div className="d-flex gap-2 align-items-center no-print">
              <label className="me-2">Select Month:</label>
              <input
                type="month"
                className="form-control form-control-sm d-inline-block"
                style={{ width: 'auto' }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handlePrint}
                disabled={isLoading || tasks.length === 0}
              >
                Print / Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="card">
          <div className="card-body text-center text-muted">
            <p>No completed tasks found for {dayjs(selectedMonth).format('MMMM YYYY')}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="card mb-3">
            <div className="card-body">
              <h5>Summary</h5>
              <p className="mb-1">
                <strong>Total Completed Tasks:</strong> {tasks.length}
              </p>
              <p className="mb-0">
                <strong>Period:</strong> {dayjs(selectedMonth).format('MMMM YYYY')}
              </p>
            </div>
          </div>

          {sortedDates.map((date) => (
            <div key={date} className="card mb-3">
              <div className="card-header">
                <strong>{dayjs(date).format('dddd, MMMM D, YYYY')}</strong>
                <span className="badge bg-primary ms-2">
                  {tasksByDate[date].length} {tasksByDate[date].length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mb-0">
                  {tasksByDate[date].map((task) => (
                    <li key={task._id} className="mb-2">
                      <span className="text-success me-2">✓</span>
                      {task.text}
                      <small className="text-muted ms-2">
                        {dayjs(task.createdAt).format('h:mm A')}
                      </small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
