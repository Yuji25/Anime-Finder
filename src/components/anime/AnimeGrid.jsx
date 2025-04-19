import AnimeCard from './AnimeCard';
import Spinner from '../ui/Spinner';

const AnimeSkeleton = () => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
    <div className="h-64 bg-gray-700"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

const AnimeGrid = ({ 
  anime = [], 
  isLoading = false, 
  error = null, 
  emptyMessage = 'No anime found.',
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 ${className}`}>
        {Array(12).fill(0).map((_, index) => (
          <AnimeSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-2">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Try again
        </button>
      </div>
    );
  }
  
  if (anime.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 ${className}`}>
      {anime.map((item) => (
        <AnimeCard key={item.mal_id} anime={item} />
      ))}
    </div>
  );
};

export default AnimeGrid; 