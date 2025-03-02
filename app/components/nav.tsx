import { NavLink } from "@remix-run/react";
import { useState } from "react";
import Logo from "./logo";
import { UserButton, useAuth } from "@clerk/remix";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Safely use useAuth - check if it actually exists in the window
  let userId = null;
  try {
    const auth = useAuth();
    userId = auth?.userId;
  } catch (e) {
    console.warn("Auth context not available", e);
  }

  return (
    <nav className="shadow-xl sticky top-0 z-50 bg-black/40 backdrop-blur-lg border-b border-gray-700 py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Logo small />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-gray-300 hover:text-white hover:bg-gray-800 py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-white bg-gray-800" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/forges"
            className={({ isActive }) =>
              `text-gray-300 hover:text-white hover:bg-gray-800 py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-white bg-gray-800" : ""
              }`
            }
          >
            Forges
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-gray-300 hover:text-white hover:bg-gray-800 py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-white bg-gray-800" : ""
              }`
            }
          >
            About
          </NavLink>
          
          {/* Authentication Links */}
          <div className="ml-4 flex items-center">
            {userId ? (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `text-gray-300 hover:text-white hover:bg-gray-800 py-2 px-3 rounded-lg transition-colors ${
                      isActive ? "text-white bg-gray-800" : ""
                    }`
                  }
                >
                  Profile
                </NavLink>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/sign-in"
                  className={({ isActive }) =>
                    `text-gray-300 hover:text-white hover:bg-gray-800 py-2 px-3 rounded-lg transition-colors ${
                      isActive ? "text-white bg-gray-800" : ""
                    }`
                  }
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/sign-up"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden px-4 py-2 bg-black/80 backdrop-blur-lg border-t border-gray-800">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg my-1 ${
                isActive ? "text-white bg-gray-800" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/forges"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg my-1 ${
                isActive ? "text-white bg-gray-800" : ""
              }`
            }
          >
            Forges
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg my-1 ${
                isActive ? "text-white bg-gray-800" : ""
              }`
            }
          >
            About
          </NavLink>
          
          {/* Mobile Authentication Links */}
          {userId ? (
            <>
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg my-1 ${
                    isActive ? "text-white bg-gray-800" : ""
                  }`
                }
              >
                Profile
              </NavLink>
              <div className="p-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/sign-in"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg my-1 ${
                    isActive ? "text-white bg-gray-800" : ""
                  }`
                }
              >
                Sign In
              </NavLink>
              <NavLink
                to="/sign-up"
                onClick={() => setIsOpen(false)}
                className="block py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg my-1"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
} 