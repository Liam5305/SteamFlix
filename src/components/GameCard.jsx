import { useNavigate } from 'react-router-dom';

function GameCard({ game }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${game.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="relative group cursor-pointer rounded-md overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105"
    >
      <img 
        src={game.background_image}
        alt={game.name}
        className="w-full h-[200px] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg">{game.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-400 font-bold">★ {game.rating}/5</span>
            {game.metacritic && (
              <span className="text-yellow-400 font-semibold">Metacritic: {game.metacritic}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
