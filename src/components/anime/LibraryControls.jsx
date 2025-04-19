import { useState, useEffect } from 'react';
import { useLibrary } from '../../hooks/useLibrary';
import Button from '../ui/Button';

const LibraryControls = ({ anime }) => {
  const { library, addAnime, removeAnime, isInSection, getWatchingStatus } = useLibrary();
  const [watchStatus, setWatchStatus] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Check if anime is already in a library section
    const status = getWatchingStatus(anime.mal_id);
    setWatchStatus(status);
    
    // Check if anime is in favorites
    const favorite = isInSection('favorites', anime.mal_id);
    setIsFavorite(favorite);
  }, [anime.mal_id, getWatchingStatus, isInSection, library]);
  
  const handleAddToLibrary = (section) => {
    if (section === 'favorites') {
      // Toggle favorite status
      if (isFavorite) {
        removeAnime('favorites', anime.mal_id);
        setIsFavorite(false);
      } else {
        addAnime('favorites', anime);
        setIsFavorite(true);
      }
    } else {
      // If already in this section, remove it
      if (watchStatus === section) {
        removeAnime(section, anime.mal_id);
        setWatchStatus(null);
      } else {
        // If in another status section, remove from there
        if (watchStatus) {
          removeAnime(watchStatus, anime.mal_id);
        }
        // Add to new section
        addAnime(section, anime);
        setWatchStatus(section);
      }
    }
    
    setIsOpen(false);
  };
  
  const sectionLabels = {
    watching: 'Watching',
    planToWatch: 'Plan to Watch',
    completed: 'Completed',
    dropped: 'Dropped'
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      {/* Main status button */}
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant={watchStatus ? 'secondary' : 'primary'}
          className="w-full sm:w-auto"
        >
          {watchStatus ? `${sectionLabels[watchStatus]}` : 'Add to Library'}
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
        
        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {Object.entries(sectionLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleAddToLibrary(key)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${
                    watchStatus === key ? 'bg-blue-600 text-white' : 'text-gray-200'
                  }`}
                  role="menuitem"
                >
                  {label}
                  {watchStatus === key && (
                    <span className="ml-2">✓</span>
                  )}
                </button>
              ))}
              
              {watchStatus && (
                <>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button
                    onClick={() => {
                      removeAnime(watchStatus, anime.mal_id);
                      setWatchStatus(null);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                    role="menuitem"
                  >
                    Remove from Library
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Backdrop for closing dropdown */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
      </div>
      
      {/* Favorite button */}
      <Button
        onClick={() => handleAddToLibrary('favorites')}
        variant={isFavorite ? 'secondary' : 'outlined'}
        className="w-full sm:w-auto flex items-center justify-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 mr-1 ${isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          fill={isFavorite ? 'currentColor' : 'none'} 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        {isFavorite ? 'Favorited' : 'Favorite'}
      </Button>
    </div>
  );
};

export default LibraryControls; 