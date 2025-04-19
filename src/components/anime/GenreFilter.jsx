import { useState, useEffect } from 'react';
import { getGenres } from '../../services/api';
import Spinner from '../ui/Spinner';

const GenreFilter = ({ selectedGenres = [], onChange }) => {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getGenres();
        if (response.error) {
          setError(response.error);
        } else if (response.data && response.data.data) {
          // Filter out adult/hentai genres
          const filteredGenres = response.data.data.filter(
            genre => !['Hentai', 'Erotica'].includes(genre.name)
          );
          setGenres(filteredGenres);
        }
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError('Failed to load genres. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (genreId) => {
    let newSelectedGenres;
    
    if (selectedGenres.includes(genreId)) {
      // Remove genre if already selected
      newSelectedGenres = selectedGenres.filter(id => id !== genreId);
    } else {
      // Add genre if not selected
      newSelectedGenres = [...selectedGenres, genreId];
    }
    
    onChange(newSelectedGenres);
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-white">Genres</h3>
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-white">Genres</h3>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-white">Genres</h3>
      
      <div className="flex flex-wrap gap-2">
        {genres.map(genre => (
          <button
            key={genre.mal_id}
            onClick={() => handleGenreClick(genre.mal_id)}
            className={`px-3 py-1 text-sm rounded-full transition ${
              selectedGenres.includes(genre.mal_id)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter; 