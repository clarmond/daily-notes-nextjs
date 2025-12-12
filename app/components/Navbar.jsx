'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    signOut();
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
            <form className="d-flex" role="search">
              <input
                className="form-control form-control-sm"
                type="search"
                placeholder="Search..."
                aria-label="Search"
              />
            </form>

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
