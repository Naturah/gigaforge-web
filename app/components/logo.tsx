import { Link } from "@remix-run/react";

interface LogoProps {
  small?: boolean;
}

function Logo({ small = false }: LogoProps) {
  return (
    <Link to="/" className="group flex items-center">
      <div className="relative">
        {/* Main logo */}
        <div className={`
          ${small ? 'text-2xl' : 'text-6xl'} 
          font-bold font-mono tracking-tight 
          bg-clip-text text-transparent
          bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
          transition-all duration-300 group-hover:scale-105
        `}>
          GIGA<span className="text-white">FORGE</span>
        </div>
        
        {/* Glow effect */}
        <div className={`
          absolute inset-0 
          ${small ? 'text-2xl' : 'text-6xl'} 
          font-bold font-mono tracking-tight
          bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
          blur-sm opacity-50 
          transition-all duration-300 group-hover:blur-md group-hover:opacity-70
        `}>
          GIGA<span className="text-white">FORGE</span>
        </div>
        
        {/* Tagline - only show on large logo */}
        {!small && (
          <div className="text-sm font-light text-gray-400 tracking-wider ml-1 mt-1">
            REVOLUTIONIZING 3D PRINTING
          </div>
        )}
      </div>
    </Link>
  );
}

export default Logo;