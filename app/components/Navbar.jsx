'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import { searchTasks } from '../actions/tasks';
import SearchResults from './SearchResults';

const Navbar = () => {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { setSelectedDate } = useGlobalContext();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const handleLogout = () => {
    signOut();
  };

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if query is too short
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Set loading state
    setIsLoading(true);
    setShowResults(true);

    // Debounce search by 300ms
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchTasks(searchQuery);
        setSearchResults(results);
        setIsLoading(false);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle clicking on a search result
  const handleResultClick = (task) => {
    // Set the selected date to the task's creation date
    const taskDate = new Date(task.createdAt);
    setSelectedDate(taskDate);

    // Navigate to dashboard
    router.push('/');

    // Close search results and clear search
    setShowResults(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom mb-4">
      <div className="container-fluid">
        {/* Left side - Menu items */}
        <div className="navbar-nav">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active fw-bold' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            href="/reports"
            className={`nav-link ${pathname === '/reports' ? 'active fw-bold' : ''}`}
          >
            Reports
          </Link>
        </div>

        {/* Right side - Search and Avatar */}
        {session && (
          <div className="d-flex align-items-center gap-3">
            {/* Search bar */}
            <div className="search-container" ref={searchContainerRef}>
              <input
                className="form-control form-control-sm"
                type="search"
                placeholder="Search tasks..."
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {showResults && (
                <SearchResults
                  results={searchResults}
                  onResultClick={handleResultClick}
                  onClose={() => setShowResults(false)}
                  isLoading={isLoading}
                  searchQuery={searchQuery}
                />
              )}
            </div>

            {/* User avatar dropdown */}
            <div className="dropdown">
              <button
                className="btn p-0 border-0 bg-transparent"
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="User avatar"
                    className="rounded-circle border"
                    style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center border"
                    style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                  >
                    <span className="text-white fw-bold">
                      {session.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </button>
              {showDropdown && (
                <ul
                  className="dropdown-menu dropdown-menu-end show"
                  style={{ position: 'absolute', right: 0 }}
                >
                  <li>
                    <span className="dropdown-item-text">
                      <strong>{session.user?.name}</strong>
                      <br />
                      <small className="text-muted">{session.user?.email}</small>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
