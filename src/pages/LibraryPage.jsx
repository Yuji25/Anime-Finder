import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabs from '../components/ui/Tabs';
import AnimeCard from '../components/anime/AnimeCard';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import { useLibrary } from '../hooks/useLibrary';

const LibraryPage = () => {
  const { library } = useLibrary();
  const navigate = useNavigate();
  
  // Handle navigation to anime details
  const handleAnimeClick = (animeId) => {
    navigate(`/anime/${animeId}`);
  };
  
  // Generate library tabs content
  const libraryTabs = [
    {
      label: `Watching (${library.watching.length})`,
      content: (
        <AnimeSection 
          title="Watching" 
          animeList={library.watching} 
          emptyMessage="You are not currently watching any anime."
          onAnimeClick={handleAnimeClick}
        />
      )
    },
    {
      label: `Plan to Watch (${library.planToWatch.length})`,
      content: (
        <AnimeSection 
          title="Plan to Watch" 
          animeList={library.planToWatch} 
          emptyMessage="Your plan-to-watch list is empty."
          onAnimeClick={handleAnimeClick}
        />
      )
    },
    {
      label: `Completed (${library.completed.length})`,
      content: (
        <AnimeSection 
          title="Completed" 
          animeList={library.completed} 
          emptyMessage="You haven't completed any anime yet."
          onAnimeClick={handleAnimeClick}
        />
      )
    },
    {
      label: `Dropped (${library.dropped.length})`,
      content: (
        <AnimeSection 
          title="Dropped" 
          animeList={library.dropped} 
          emptyMessage="You haven't dropped any anime."
          onAnimeClick={handleAnimeClick}
        />
      )
    },
    {
      label: `Favorites (${library.favorites.length})`,
      content: (
        <AnimeSection 
          title="Favorites" 
          animeList={library.favorites} 
          emptyMessage="You don't have any favorite anime yet."
          onAnimeClick={handleAnimeClick}
        />
      )
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle 
        title="My Library" 
        subtitle="Manage your anime collection"
      />
      
      <div className="mt-8">
        {(library.watching.length === 0 && 
          library.planToWatch.length === 0 && 
          library.completed.length === 0 && 
          library.dropped.length === 0 && 
          library.favorites.length === 0) ? (
          
          <EmptyLibrary navigate={navigate} />
          
        ) : (
          <Tabs tabs={libraryTabs} />
        )}
      </div>
    </div>
  );
};

// Empty library component
const EmptyLibrary = ({ navigate }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-8 text-center">
      <h3 className="text-xl font-semibold text-white mb-4">Your library is empty</h3>
      <p className="text-gray-400 mb-8 max-w-lg mx-auto">
        Start building your anime collection by browsing anime and adding them to your library.
      </p>
      <Button 
        onClick={() => navigate('/browse')}
        variant="primary"
        size="lg"
      >
        Browse Anime
      </Button>
    </div>
  );
};

// Individual section display
const AnimeSection = ({ title, animeList, emptyMessage, onAnimeClick }) => {
  return (
    <div className="py-6">
      {animeList.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {animeList.map(anime => (
            <div 
              key={anime.mal_id} 
              onClick={() => onAnimeClick(anime.mal_id)}
              className="cursor-pointer"
            >
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage; 