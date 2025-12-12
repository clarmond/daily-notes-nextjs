'use client';

import dayjs from 'dayjs';

const SearchResults = ({ results, onResultClick, onClose, isLoading, searchQuery }) => {
  if (isLoading) {
    return (
      <div className="search-results-dropdown">
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2 text-muted">Searching...</span>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="search-results-dropdown">
        <div className="text-center py-3 text-muted">
          {searchQuery ? `No tasks found for "${searchQuery}"` : 'No results'}
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-dropdown">
      <div className="search-results-header px-3 py-2 border-bottom">
        <small className="text-muted">
          {results.length} {results.length === 1 ? 'result' : 'results'} found
        </small>
      </div>
      <div className="search-results-list">
        {results.map((task) => (
          <div
            key={task._id}
            className="search-result-item px-3 py-2"
            onClick={() => onResultClick(task)}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-1">
                  {task.is_completed && (
                    <span className="text-success">✓</span>
                  )}
                  {task.is_note && (
                    <span className="badge bg-secondary badge-sm">Note</span>
                  )}
                  {!task.is_note && !task.is_completed && (
                    <span className="badge bg-primary badge-sm">Task</span>
                  )}
                </div>
                <div className="search-result-text">
                  {task.text}
                </div>
              </div>
              <div className="text-end ms-2">
                <small className="text-muted">
                  {dayjs(task.createdAt).format('MMM D, YYYY')}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
