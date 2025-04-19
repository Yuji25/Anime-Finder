import { Link } from 'react-router-dom';

const AnimeCard = ({ anime }) => {
  // Fallback image for anime without images
  const fallbackImage = "https://via.placeholder.com/225x318/1a202c/ffffff?text=No+Image";
  
  // Format the score with one decimal place
  const formattedScore = anime.score ? anime.score.toFixed(1) : "N/A";
  
  // Get the image URL or use fallback
  const imageUrl = anime.images?.jpg?.image_url || fallbackImage;
  
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-blue-400/30">
      <Link to={`/anime/${anime.mal_id}`} className="block">
        <div className="relative pb-[140%] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={anime.title} 
            className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Score badge */}
          {anime.score && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              {formattedScore}
            </div>
          )}
          
          {/* Info overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <p className="text-white text-xs line-clamp-3">
              {anime.synopsis || "No description available."}
            </p>
          </div>
        </div>
        
        {/* Card footer */}
        <div className="p-4">
          <h3 className="text-white font-medium text-sm md:text-base line-clamp-2 h-12">
            {anime.title}
          </h3>
          <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
            <span>{anime.type || "Unknown"}</span>
            <span>{anime.episodes ? `${anime.episodes} eps` : anime.status || "Unknown"}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnimeCard; 