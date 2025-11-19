import { NavLink } from "@remix-run/react";
import { useState } from "react";
import Logo from "./logo";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="shadow-xl sticky top-0 z-50 bg-black/40 backdrop-blur-lg border-b border-gray-700 py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Logo small />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavLink to="/" className={({isActive}) =>
            isActive ? "text-white font-medium" : "text-gray-400 hover:text-white transition-colors"
          }>
            Home
          </NavLink>
          <NavLink to="/forges" className={({isActive}) =>
            isActive ? "text-white font-medium" : "text-gray-400 hover:text-white transition-colors"
          }>
            3D Forges
          </NavLink>
          <NavLink to="/about" className={({isActive}) =>
            isActive ? "text-white font-medium" : "text-gray-400 hover:text-white transition-colors"
          }>
            About
          </NavLink>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isOpen ? (
                <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z" />
              ) : (
                <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden pt-4 pb-3 border-t border-gray-700 mt-3">
          <div className="container mx-auto px-4 space-y-1">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={({isActive}) =>
                isActive
                  ? "block px-3 py-2 rounded-md bg-blue-900 text-white font-medium"
                  : "block px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/forges"
              onClick={() => setIsOpen(false)}
              className={({isActive}) =>
                isActive
                  ? "block px-3 py-2 rounded-md bg-blue-900 text-white font-medium"
                  : "block px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              }
            >
              3D Forges
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setIsOpen(false)}
              className={({isActive}) =>
                isActive
                  ? "block px-3 py-2 rounded-md bg-blue-900 text-white font-medium"
                  : "block px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              }
            >
              About
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
