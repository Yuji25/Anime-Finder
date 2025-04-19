import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/ui/SearchBar';
import AnimeCard from '../components/anime/AnimeCard';
import CharacterCard from '../components/anime/CharacterCard';
import SectionTitle from '../components/ui/SectionTitle';
import Spinner from '../components/ui/Spinner';
import { getTopAnime, getTopCharacters, getCurrentSeasonAnime } from '../services/api';

const HomePage = () => {
  const [topAnime, setTopAnime] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [topCharacters, setTopCharacters] = useState([]);
  const [loading, setLoading] = useState({
    topAnime: true,
    seasonal: true,
    characters: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topAnimeResponse = await getTopAnime(1, 12);
        if (topAnimeResponse?.data?.data) {
          setTopAnime(topAnimeResponse.data.data);
        }
        setLoading(prev => ({ ...prev, topAnime: false }));

        const seasonalResponse = await getCurrentSeasonAnime(1, 12);
        if (seasonalResponse?.data?.data) {
          setSeasonalAnime(seasonalResponse.data.data);
        }
        setLoading(prev => ({ ...prev, seasonal: false }));

        const charactersResponse = await getTopCharacters(1, 12);
        if (charactersResponse?.data?.data) {
          setTopCharacters(charactersResponse.data.data);
        }
        setLoading(prev => ({ ...prev, characters: false }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading({
          topAnime: false,
          seasonal: false,
          characters: false
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <section className="relative min-h-[75vh] bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center py-12 sm:py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/70 to-gray-900"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtOGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHptLTggNGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHptOCAwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-8 leading-tight">
              Discover Your Next <span className="text-blue-400">Anime</span> Adventure
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12">
              Explore, track, and organize your anime watching experience
            </p>
            
            <SearchBar className="mb-8 sm:mb-12" />
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link 
                to="/browse"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
              >
                Browse Anime
              </Link>
              <Link 
                to="/library"
                className="w-full sm:w-auto px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition text-center"
              >
                My Library
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-8 sm:py-12 container mx-auto px-4">
        <SectionTitle 
          title="Trending Anime" 
          subtitle="The most popular anime right now"
          actionText="View All"
          actionLink="/browse"
        />
        
        {loading.topAnime ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {topAnime.slice(0, 6).map(anime => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )}
      </section>
      
      <section className="py-8 sm:py-12 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="This Season" 
            subtitle="Currently airing anime this season"
            actionText="View More"
            actionLink="/browse?season=current"
          />
          
          {loading.seasonal ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {seasonalAnime.slice(0, 6).map(anime => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <section className="py-8 sm:py-12 container mx-auto px-4">
        <SectionTitle 
          title="Popular Characters" 
          subtitle="Most loved anime characters"
        />
        
        {loading.characters ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {topCharacters.slice(0, 6).map(character => (
              <CharacterCard key={character.mal_id} character={character} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage; 