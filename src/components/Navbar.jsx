import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import GameHiveLogo from '../assets/GameHive.png'

function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-gray-800 bg-opacity-90 shadow-lg z-50 py-4">
      <div className="container mx-auto px-6">
        <div className="flex items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-4">
            <img 
              src={GameHiveLogo} 
              alt="GameHive Logo" 
              className="h-[100px] w-[100px] object-contain" // Tailwind classes for size and object fit
            />
            <Link to="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
              GameHive
            </Link>
            {/* Navigation links right after logo */}
            <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/browse" 
                className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
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