import { NavLink } from "@remix-run/react";
import { useState } from "react";
import Logo from "./logo";
import { UserButton, useAuth } from "@clerk/remix";

// Safe UserButton component with error handling
function SafeUserButton() {
  try {
    return (
      <UserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonBox: "hover:opacity-80 transition-opacity",
            userButtonTrigger: "focus:shadow-none",
            userButtonPopoverCard: "bg-gray-900 border border-gray-700",
            userButtonPopoverFooter: "border-gray-700",
            userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-gray-800",
            userButtonPopoverActionButtonText: "text-current",
          }
        }}
      />
    );
  } catch (e) {
    console.error("Error rendering UserButton:", e);
    return null;
  }
}

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use try/catch block to safely handle Clerk auth
  let userId = null;
  try {
    // Use the useAuth hook directly
    const { userId: clerkUserId } = useAuth();
    userId = clerkUserId;
  } catch (error) {
    console.error("Error using Clerk auth hook:", error);
    // Keep userId as null
  }

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
          
          {/* Auth-dependent links */}
          {userId ? (
            <>
              <NavLink to="/profile" className={({isActive}) => 
                isActive ? "text-white font-medium" : "text-gray-400 hover:text-white transition-colors"
              }>
                My Profile
              </NavLink>
              {/* Using the safe component instead of try/catch in JSX */}
              <SafeUserButton />
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/sign-in"
                className="text-gray-200 hover:text-white transition-colors"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/sign-up"
                className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 rounded-lg text-white hover:from-blue-700 hover:to-blue-800 transition-colors"
              >
                Sign Up
              </NavLink>
            </div>
          )}
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
            
            {userId && (
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={({isActive}) => 
                  isActive 
                    ? "block px-3 py-2 rounded-md bg-blue-900 text-white font-medium"
                    : "block px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
                }
              >
                My Profile
              </NavLink>
            )}
            
            {/* Auth buttons */}
            {!userId && (
              <div className="pt-4 pb-2 border-t border-gray-700 mt-2 flex flex-col space-y-2">
                <NavLink
                  to="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-800"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 