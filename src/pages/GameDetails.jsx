import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGames } from '../utils/api';
import { getAllStorePrices } from '../services/storeApis';
import PriceDisplay from '../components/PriceDisplay';

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPricesLoading, setIsPricesLoading] = useState(true);
  const [storePrices, setStorePrices] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      setIsLoading(true);
      setIsPricesLoading(true);
      try {
        // Fetch main game data
        const gameData = await fetchGames(`/games/${id}`);
        setGame(gameData);

        // Fetch screenshots
        const screenshotsData = await fetchGames(`/games/${id}/screenshots`);
        if (screenshotsData?.results) {
          setScreenshots(screenshotsData.results);
        }

        // Fetch store prices
        if (gameData) {
          const prices = await getAllStorePrices(gameData.name, gameData.steam_id);
          setStorePrices(prices);
        }

      } catch (err) {
        setError('Failed to load game details');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
        setIsPricesLoading(false);
      }
    };

    fetchGameDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Error loading game details</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <div className="absolute inset-0">
          <img 
            src={game.background_image}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        </div>

        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-6 pb-12">
            <h1 className="text-5xl font-bold mb-4">{game.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              {game.metacritic && (
                <span className="px-3 py-1 bg-green-600 rounded-full">
                  Metacritic: {game.metacritic}
                </span>
              )}
              <span>Release Date: {new Date(game.released).toLocaleDateString()}</span>
              <span>Rating: {game.rating}/5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Store Prices Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Where to Buy</h2>
          {isPricesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                  <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : storePrices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {storePrices.map((store, index) => (
                <a 
                  key={index}
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition group"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={store.storeIcon}
                      alt={store.storeName}
                      className="w-8 h-8 rounded"
                    />
                    <div>
                      <h3 className="font-semibold group-hover:text-white">
                        {store.storeName}
                      </h3>
                      <div className="flex items-center gap-2">
                        {store.isSubscription ? (
                          <span className="text-green-400">
                            {store.price}
                          </span>
                        ) : (
                          <PriceDisplay price={store.price} />
                        )}
                        {store.isOnSale && (
                          <span className="text-xs bg-green-600 px-2 py-1 rounded">
                            -{store.savings}%
                          </span>
                        )}
                      </div>
                      {store.retailPrice && store.price !== store.retailPrice && !store.isSubscription && (
                        <PriceDisplay price={store.retailPrice} isOriginal />
                      )}
                      {store.isSubscription && (
                        <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                          Subscription
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-800 rounded-lg">
              <p className="text-gray-400">No store pricing available for this game</p>
            </div>
          )}
        </div>

        {/* Game Details Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="flex gap-8">
            <button
              className={`pb-4 px-2 ${activeTab === 'about' ? 'border-b-2 border-red-500' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button
              className={`pb-4 px-2 ${activeTab === 'media' ? 'border-b-2 border-red-500' : ''}`}
              onClick={() => setActiveTab('media')}
            >
              Media
            </button>
            <button
              className={`pb-4 px-2 ${activeTab === 'requirements' ? 'border-b-2 border-red-500' : ''}`}
              onClick={() => setActiveTab('requirements')}
            >
              System Requirements
            </button>
          </nav>
        </div>

        {/* Tab Content and Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'about' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-gray-300 mb-6">{game.description_raw}</p>
                
                <h3 className="text-xl font-bold mb-3">Features</h3>
                <ul className="list-disc list-inside mb-6 text-gray-300">
                  {game.tags?.slice(0, 5).map(tag => (
                    <li key={tag.id}>{tag.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="grid grid-cols-2 gap-4">
                {screenshots.map((screenshot, index) => (
                  <img 
                    key={index}
                    src={screenshot.image}
                    alt={`Screenshot ${index + 1}`}
                    className="rounded-lg w-full cursor-pointer"
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            )}

            {activeTab === 'requirements' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">System Requirements</h2>
                {game.platforms?.map(platform => {
                  if (platform.platform.name !== 'PC') return null;

                  const parseRequirements = (reqString) => {
                    if (!reqString) return null;

                    // Create a structured format regardless of language
                    const lines = reqString.split('\n').map((line, i) => <li key={i}>{line}</li>);
                    return <ul>{lines}</ul>;
                  };

                  return (
                    <div key={platform.platform.id}>
                      <h3 className="text-xl font-bold mb-2">{platform.platform.name}</h3>
                      <div>
                        <strong>Minimum:</strong>
                        {parseRequirements(platform.minimum)}
                      </div>
                      <div>
                        <strong>Recommended:</strong>
                        {parseRequirements(platform.recommended)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar (can add more content later) */}
          <div className="hidden lg:block bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Similar Games</h2>
            {/* Placeholder for similar games */}
            <p className="text-gray-400">You might also like these games.</p>
          </div>
        </div>
      </div>

      {/* Modal for Screenshot */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative">
            <img 
              src={screenshots[selectedImageIndex].image}
              alt={`Screenshot ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full"
            />
            <button
              className="absolute top-2 right-2 text-white"
              onClick={() => setSelectedImageIndex(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameDetails;
