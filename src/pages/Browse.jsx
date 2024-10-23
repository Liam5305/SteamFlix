import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGames } from "../utils/api";
import { useSearchParams } from "react-router-dom";

function Browse() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [sortBy, setSortBy] = useState("-rating"); // Default sort by rating
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [searchParams] = useSearchParams();

  const GAME_ALIASES = {
    "call of duty": ["cod", "call of duty"],
    "counter strike": ["cs", "csgo", "counter-strike"],
    "grand theft auto": ["gta"],
    "player unknowns battlegrounds": ["pubg"],
    "the witcher": ["witcher"],
    // Add more as needed
  };

  const getSearchTerms = (searchTerm) => {
    const lowerSearch = searchTerm.toLowerCase();
    for (const [game, aliases] of Object.entries(GAME_ALIASES)) {
      if (aliases.some(alias => lowerSearch.includes(alias)) || 
          lowerSearch.includes(game)) {
        return aliases;
      }
    }
    return [searchTerm];
  };

  // Generate year filter
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1990 + 1 },
    (_, i) => currentYear - i
  );

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [genresData, platformsData] = await Promise.all([
          fetchGames('/genres'),
          fetchGames('/platforms')
        ]);
        setGenres(genresData.results || []);
        setPlatforms(platformsData.results || []);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch Genre and Platforms
  useEffect(() => {
    const fetchFilteredGames = async () => {
      setIsLoading(true);
      try {
        const searchTerm = searchParams.get('search');
        console.log('Searching for:', searchTerm); // Debug log
    
        const params = {
          ordering: sortBy,
          page_size: 30,
          page: page,
          search: searchTerm,
          search_exact: false,  // Changed from search_precise
          parent_platforms: '1,2,3', // Include major platforms
        };
    
        if (selectedGenre) params.genres = selectedGenre;
        if (selectedPlatform) params.platforms = selectedPlatform;
        if (selectedYear) params.dates = `${selectedYear}-01-01,${selectedYear}-12-31`;
    
        const data = await fetchGames('/games', params);
        console.log('API Response:', data); // Debug log to see what the API returns
    
        if (!data.results?.length && searchTerm) {
          // Try alternative search if no results
          const alternativeParams = {
            ...params,
            search: searchTerm.toLowerCase().includes('call of duty') ? 'cod' : searchTerm
          };
          const alternativeData = await fetchGames('/games', alternativeParams);
          setGames(alternativeData.results || []);
        } else {
          setGames(data.results || []);
        }
      } catch (err) {
        setError('Failed to load games');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredGames();
  }, [selectedGenre, selectedPlatform, selectedYear, sortBy, page, searchParams]);

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setPage(1);
  };

  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
    setPage(1);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Error loading games</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Genre</label>
              <select
                value={selectedGenre}
                onChange={handleGenreChange}
                className="w-full bg-gray-700 text-white rounded p-1"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Platform</label>
              <select
                value={selectedPlatform}
                onChange={handlePlatformChange}
                className="w-full bg-gray-700 text-white rounded p-1"
              >
                <option value="">All Platforms</option>
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Release Year
              </label>
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="w-full bg-gray-700 text-white rounded p-1"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full bg-gray-700 text-white rounded p-1"
              >
                <option value="-rating">Rating (High to Low)</option>
                <option value="rating">Rating (Low to High)</option>
                <option value="-released">Release Date (Newest)</option>
                <option value="released">Release Date (Oldest)</option>
                <option value="-metacritic">Metacritic (High to Low)</option>
                <option value="metacritic">Metacritic (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 8].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="aspect-video bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{game.name}</h3>
                    <div className="flex items-center gap-2">
                      {game.metacritic && (
                        <span className="px-2 py-1 bg-green-600 rounded text-sm">
                          {game.metacritic}
                        </span>
                      )}
                      <span className="text-sm">
                        {new Date(game.released).getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="bg-gray-700 text-white px-4 py-2 rounded-l hover:bg-gray-600 transition mb-2 sm:mb-0"
              >
                Previous
              </button>
              <span className="bg-gray-700 text-white px-4 py-2">
                Page {page}
              </span>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="bg-gray-700 text-white px-4 py-2 rounded-r hover:bg-gray-600 transition"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Browse;