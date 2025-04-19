import { createContext, useState, useEffect } from 'react';

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState(() => {
    // Load from localStorage on initial render
    const savedLibrary = localStorage.getItem('animeLibrary');
    return savedLibrary ? JSON.parse(savedLibrary) : {
      watching: [],
      planToWatch: [],
      completed: [],
      dropped: [],
      favorites: []
    };
  });

  // Save to localStorage whenever library changes
  useEffect(() => {
    localStorage.setItem('animeLibrary', JSON.stringify(library));
  }, [library]);

  // Add anime to a specific section
  const addAnime = (section, anime) => {
    // Check if anime is already in this section
    const isAlreadyAdded = library[section].some(item => item.mal_id === anime.mal_id);
    
    if (!isAlreadyAdded) {
      setLibrary(prev => ({
        ...prev,
        [section]: [...prev[section], anime]
      }));
      return true;
    }
    return false;
  };

  // Remove anime from a specific section
  const removeAnime = (section, animeId) => {
    setLibrary(prev => ({
      ...prev,
      [section]: prev[section].filter(anime => anime.mal_id !== animeId)
    }));
  };

  // Move anime from one section to another
  const moveAnime = (fromSection, toSection, anime) => {
    removeAnime(fromSection, anime.mal_id);
    addAnime(toSection, anime);
  };

  // Check if anime exists in a specific section
  const isInSection = (section, animeId) => {
    return library[section].some(anime => anime.mal_id === animeId);
  };

  // Check if anime exists in any section except favorites
  const getWatchingStatus = (animeId) => {
    const sections = ['watching', 'planToWatch', 'completed', 'dropped'];
    for (const section of sections) {
      if (library[section].some(anime => anime.mal_id === animeId)) {
        return section;
      }
    }
    return null;
  };

  // Check if anime exists in any section (backwards compatibility)
  const isInLibrary = (animeId) => {
    const watchingStatus = getWatchingStatus(animeId);
    if (watchingStatus) return watchingStatus;
    if (isInSection('favorites', animeId)) return 'favorites';
    return null;
  };

  return (
    <LibraryContext.Provider value={{
      library,
      addAnime,
      removeAnime,
      moveAnime,
      isInLibrary,
      isInSection,
      getWatchingStatus
    }}>
      {children}
    </LibraryContext.Provider>
  );
}; 