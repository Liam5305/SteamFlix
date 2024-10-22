import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-black/90 fixed w-full z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-red-600">
            SteamFlix
          </Link>
          <div className="space-x-6">
            <Link to="/" className="text-white hover:text-gray-300">Home</Link>
            <Link to="/browse" className="text-white hover:text-gray-300">Browse</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;