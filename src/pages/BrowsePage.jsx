import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/ui/SearchBar';
import AnimeGrid from '../components/anime/AnimeGrid';
import GenreFilter from '../components/anime/GenreFilter';
import Pagination from '../components/ui/Pagination';
import SectionTitle from '../components/ui/SectionTitle';
import { getAnimeByGenre, getCurrentSeasonAnime, getTopAnime, searchAnime } from '../services/api';

const BrowsePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState(
    queryParams.get('genres') ? queryParams.get('genres').split(',').map(Number) : []
  );
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(parseInt(queryParams.get('page') || '1', 10));
  const [showFilters, setShowFilters] = useState(false);
  
  const updateFilters = (genres) => {
    setSelectedGenres(genres);
    
    const params = new URLSearchParams(location.search);
    
    if (genres.length > 0) {
      params.set('genres', genres.join(','));
    } else {
      params.delete('genres');
    }
    
    params.set('page', '1');
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const fetchAnime = async () => {
      try {
        let response;
        
        const query = queryParams.get('q');
        const season = queryParams.get('season');
        
        console.log(`Fetching anime with params: query=${query}, genres=${selectedGenres}, season=${season}, page=${currentPage}`);
        
        if (query) {
          response = await searchAnime(query, currentPage, 24);
        } else if (selectedGenres.length > 0) {
          const genreIds = selectedGenres.join(',');
          response = await getAnimeByGenre(selectedGenres, currentPage, 24);
        } else if (season) {
          response = await getCurrentSeasonAnime(currentPage, 24);
        } else {
          response = await getTopAnime(currentPage, 24);
        }
        
        console.log('API response:', response);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setAnime(response.data.data);
        setTotalPages(response.data.pagination?.last_visible_page || 1);
      } catch (err) {
        console.error('Error fetching anime:', err);
        setError('Failed to load anime. Please try again later. ' + err.message);
        setAnime([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnime();
  }, [queryParams.get('q'), selectedGenres, queryParams.get('season'), currentPage]);
  
  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page.toString());
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const getPageTitle = () => {
    const query = queryParams.get('q');
    const season = queryParams.get('season');
    
    if (query) {
      return `Search Results for "${query}"`;
    } else if (season === 'current') {
      return 'Current Season Anime';
    } else if (selectedGenres.length > 0) {
      return 'Filtered Anime';
    } else {
      return 'Top Anime';
    }
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SectionTitle 
          title={getPageTitle()} 
        />
        
        <div className="mt-8">
          <SearchBar />
        </div>
      </div>
      
      <div className="lg:hidden mb-4">
        <button
          onClick={toggleFilters}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center"
        >
          <span className="mr-2">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={`lg:col-span-1 ${showFilters || 'hidden lg:block'}`}>
          <div className="bg-gray-800 rounded-lg p-5 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-white mb-6">Filters</h2>
            <GenreFilter onChange={updateFilters} selectedGenres={selectedGenres} />
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <AnimeGrid 
            anime={anime} 
            isLoading={isLoading} 
            error={error}
            emptyMessage={queryParams.get('q') ? `No results found for "${queryParams.get('q')}"` : 'No anime found.'}
            className="min-h-[300px]"
          />
          
          {!isLoading && !error && totalPages > 1 && (
            <div className="mt-8">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages > 20 ? 20 : totalPages}
                onPageChange={handlePageChange} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePage; 