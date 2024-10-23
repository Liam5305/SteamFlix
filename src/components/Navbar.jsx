// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black/90 shadow-lg z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-red-600">
              SteamFlix
            </Link>
            {/* Navigation links right after logo */}
            <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-200 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/browse" 
                className="text-sm font-medium text-gray-200 hover:text-white transition-colors"
              >
                Browse
              </Link>
            </div>
          </div>

          {/* Right side - Search */}
          <div className="ml-auto">
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;