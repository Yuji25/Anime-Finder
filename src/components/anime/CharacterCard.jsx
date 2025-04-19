const CharacterCard = ({ character }) => {
  // Fallback image for characters without images
  const fallbackImage = "https://via.placeholder.com/225x318/1a202c/ffffff?text=No+Image";
  
  // Get the image URL or use fallback
  const imageUrl = character.images?.jpg?.image_url || fallbackImage;
  
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-blue-400/30">
      <div className="relative pb-[140%] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={character.name} 
          className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Popularity badge */}
        {character.favorites > 0 && (
          <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
            </svg>
            {character.favorites.toLocaleString()}
          </div>
        )}
        
        {/* Character role overlay */}
        {character.role && (
          <div className="absolute bottom-2 left-2 bg-blue-500/80 text-white text-xs px-2 py-1 rounded">
            {character.role}
          </div>
        )}
      </div>
      
      {/* Card footer */}
      <div className="p-4">
        <h3 className="text-white font-medium text-sm md:text-base line-clamp-2 h-12">
          {character.name}
        </h3>
        {character.anime && character.anime.length > 0 && (
          <p className="mt-1 text-xs text-gray-400 line-clamp-1">
            {character.anime[0].anime.title}
          </p>
        )}
      </div>
    </div>
  );
};

export default CharacterCard; 