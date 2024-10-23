import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsExpanded(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex items-center">
        <div className={`flex items-center ${isExpanded ? 'w-64' : 'w-8'} transition-all duration-300`}>
          {isExpanded && (
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-l-lg pl-3 pr-4 py-1.5 focus:outline-none"
              autoFocus
            />
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 ${isExpanded ? 'bg-gray-800 rounded-r-lg' : 'hover:bg-gray-800 rounded-lg'}`}
          >
            <svg 
              className="h-5 w-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Click outside to close */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}

export default SearchBar;