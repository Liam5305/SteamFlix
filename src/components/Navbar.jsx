import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import GameHiveLogo from '../assets/GameHive.png';

function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-gray-800 bg-opacity-90 shadow-lg z-50 py-4">
      <div className="container mx-auto px-6">
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col space-y-4">
          {/* Top Row - Logo and Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={GameHiveLogo}
                alt="GameHive Logo"
                className="h-[50px] w-[50px] object-contain"
              />
              <Link to="/" className="text-xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
                GameHive
              </Link>
            </div>
            <SearchBar />
          </div>
          {/* Bottom Row - Navigation */}
          <div className="flex justify-center space-x-8">
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

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center h-16">
          <div className="flex items-center space-x-4">
            <img
              src={GameHiveLogo}
              alt="GameHive Logo"
              className="h-[100px] w-[100px] object-contain"
            />
            <Link to="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
              GameHive
            </Link>
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
          <div className="ml-auto">
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;