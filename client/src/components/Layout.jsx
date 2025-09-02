import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b bg-white/90 backdrop-blur sticky top-0 z-10">
        <nav className="container flex items-center gap-4 py-3 relative">
          <Link to="/customers" className="font-semibold text-2xl">
            Qwipo CRM
          </Link>
          {/* Desktop Nav */}
          <div className="ml-auto hidden md:flex gap-2 text-sm">
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full ${
                  isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                }`
              }
            >
              Customers
            </NavLink>
            <NavLink
              to="/reports/one-address"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full ${
                  isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                }`
              }
            >
              Only One Address
            </NavLink>
            <NavLink
              to="/reports/multiple-address"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full ${
                  isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                }`
              }
            >
              Multiple Addresses
            </NavLink>
          </div>
          {/* Mobile Nav Toggle */}
          <button
            className="ml-auto md:hidden p-2 rounded focus:outline-none focus:ring"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>
          {/* Mobile Nav Dropdown */}
          {menuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded shadow-md flex flex-col md:hidden z-20">
              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  `px-4 py-2 ${
                    isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Customers
              </NavLink>
              <NavLink
                to="/reports/one-address"
                className={({ isActive }) =>
                  `px-4 py-2 ${
                    isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Only One Address
              </NavLink>
              <NavLink
                to="/reports/multiple-address"
                className={({ isActive }) =>
                  `px-4 py-2 ${
                    isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Multiple Addresses
              </NavLink>
            </div>
          )}
        </nav>
      </header>

      <main className="container flex-1 py-6">
        <Outlet />
      </main>

      <footer className="border-t text-xs text-gray-500 py-3">
        <div className="container">{pathname}</div>
      </footer>
    </div>
  );
}
