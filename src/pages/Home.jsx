import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGames } from '../utils/api';

function Home() {
  const navigate = useNavigate(); 
  const [popularGames, setPopularGames] = useState([]);
  const [newGames, setNewGames] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [featuredGame, setFeaturedGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllGames = async () => {
      setIsLoading(true);
      try {
        // Get popular games
        const popularResponse = await fetchGames('/games', {
          ordering: '-added',
          dates: '2023-01-01,2024-12-31',
          page_size: 10
        });
        if (popularResponse?.results) {
          setPopularGames(popularResponse.results);
          setFeaturedGame(popularResponse.results[0]);
        }

        // Get new releases
        const today = new Date();
        const lastMonth = new Date(today.setMonth(today.getMonth() - 1))
          .toISOString().split('T')[0];
        
        const newResponse = await fetchGames('/games', {
          dates: `${lastMonth},2024-12-31`,
          ordering: '-released',
          page_size: 10
        });
        if (newResponse?.results) {
          setNewGames(newResponse.results);
        }

        // Get top rated games
        const topResponse = await fetchGames('/games', {
          ordering: '-rating',
          metacritic: '80,100',
          page_size: 10
        });
        if (topResponse?.results) {
          setTopRated(topResponse.results);
        }

      } catch (err) {
        setError('Failed to load games');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllGames();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      {featuredGame && (
        <div className="relative h-[80vh] w-full">
          <div className="absolute inset-0">
            <img 
              src={featuredGame.background_image}
              alt={featuredGame.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          </div>

          <div className="relative pt-[20%] px-16 z-10">
            <h1 className="text-6xl font-bold text-white mb-4">
              {featuredGame.name}
            </h1>
            <div className="flex gap-4 items-center mb-6">
              {featuredGame.metacritic && (
                <span className="text-green-500">
                  Metacritic: {featuredGame.metacritic}
                </span>
              )}
              <span className="text-gray-300">
                Released: {new Date(featuredGame.released).getFullYear()}
              </span>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate(`/game/${featuredGame.id}`)}
                className="bg-red-600 text-white px-8 py-3 rounded hover:bg-red-700 transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Learn More
              </button>
              <button 
                onClick={() => navigate(`/game/${featuredGame.id}`)}
                className="bg-gray-800 text-white px-8 py-3 rounded hover:bg-gray-700 transition"
              >
                More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Rows */}
      <div className="px-16 -mt-32 relative z-20 space-y-8 pb-16">
        {popularGames.length > 0 && (
          <GameRow title="Popular Games" games={popularGames} />
        )}
        {newGames.length > 0 && (
          <GameRow title="New Releases" games={newGames} />
        )}
        {topRated.length > 0 && (
          <GameRow title="Top Rated" games={topRated} />
        )}
      </div>
    </div>
  );
}

// GameRow Component
function GameRow({ title, games }) {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {games.map((game) => (
          <GameCard 
            key={game.id} 
            game={game} 
            onClick={() => navigate(`/game/${game.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

// GameCard Component
function GameCard({ game, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="relative group cursor-pointer transform transition-transform duration-300 hover:scale-105"
    >
      <img 
        src={game.background_image}
        alt={game.name}
        className="w-full h-[200px] object-cover rounded-md"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold">{game.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-400">★ {game.rating}/5</span>
            {game.metacritic && (
              <span className="text-yellow-400">Metacritic: {game.metacritic}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {game.genres?.slice(0, 2).map(genre => (
              <span 
                key={genre.id}
                className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-300"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;