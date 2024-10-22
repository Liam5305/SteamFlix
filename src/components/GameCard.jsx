// If you have a separate GameCard component file (src/components/GameCard.jsx):
import { useNavigate } from 'react-router-dom';

function GameCard({ game }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${game.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="relative group cursor-pointer"
    >
      <img 
        src={game.background_image}
        alt={game.name}
        className="w-full h-[200px] object-cover rounded-md transform transition-transform duration-300 group-hover:scale-105"
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
        </div>
      </div>
    </div>
  );
}

export default GameCard;