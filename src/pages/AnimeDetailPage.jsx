import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimeById, getAnimeCharacters, getAnimeRecommendations } from '../services/api';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import AnimeCard from '../components/anime/AnimeCard';
import CharacterCard from '../components/anime/CharacterCard';
import LibraryControls from '../components/anime/LibraryControls';

const animeCache = new Map();
const charactersCache = new Map();
const recommendationsCache = new Map();
const recommendedAnimeCache = new Map();

const CACHE_EXPIRY = 5 * 60 * 1000;

const AnimeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendedAnimeDetails, setRecommendedAnimeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandSynopsis, setExpandSynopsis] = useState(false);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const now = Date.now();
        const cacheKey = id.toString();
        
        const processAnimeData = async () => {
          const cachedData = animeCache.get(cacheKey);
          if (cachedData && now - cachedData.timestamp < CACHE_EXPIRY) {
            console.log('Using cached anime data');
            setAnime(cachedData.data);
            return true;
          }
          
          const animeResponse = await getAnimeById(id);
          if (animeResponse?.data?.data) {
            const animeData = animeResponse.data.data;
            setAnime(animeData);
            animeCache.set(cacheKey, {
              data: animeData,
              timestamp: now
            });
            return true;
          }
          return false;
        };
        
        const processCharactersData = async () => {
          const cachedData = charactersCache.get(cacheKey);
          if (cachedData && now - cachedData.timestamp < CACHE_EXPIRY) {
            console.log('Using cached characters data');
            setCharacters(cachedData.data);
            return;
          }
          
          const charactersResponse = await getAnimeCharacters(id);
          if (charactersResponse?.data?.data) {
            const charactersData = charactersResponse.data.data;
            setCharacters(charactersData);
            charactersCache.set(cacheKey, {
              data: charactersData,
              timestamp: now
            });
          }
        };
        
        const processRecommendationsData = async () => {
          const cachedData = recommendationsCache.get(cacheKey);
          if (cachedData && now - cachedData.timestamp < CACHE_EXPIRY) {
            console.log('Using cached recommendations data');
            setRecommendations(cachedData.data);
            return cachedData.data;
          }
          
          const recommendationsResponse = await getAnimeRecommendations(id);
          if (recommendationsResponse?.data?.data) {
            const recommendationsData = recommendationsResponse.data.data;
            setRecommendations(recommendationsData);
            recommendationsCache.set(cacheKey, {
              data: recommendationsData,
              timestamp: now
            });
            return recommendationsData;
          }
          return [];
        };
        
        const animeFound = await processAnimeData();
        
        if (animeFound) {
          await Promise.all([
            processCharactersData(),
            processRecommendationsData().then(async (recsData) => {
              if (recsData && recsData.length > 0) {
                await fetchRecommendedAnimeDetails(recsData.slice(0, 6));
              }
            })
          ]);
        }
      } catch (err) {
        console.error('Error fetching anime details:', err);
        setError('Failed to load anime details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnimeDetails();
    window.scrollTo(0, 0);
    setExpandSynopsis(false);
    setRecommendedAnimeDetails([]);
  }, [id]);
  
  const fetchRecommendedAnimeDetails = async (recommendations) => {
    if (!recommendations || recommendations.length === 0) return;
    
    setRecommendationsLoading(true);
    const now = Date.now();
    const detailedRecommendations = [];
    
    try {
      // Process each recommendation to get full details
      const promises = recommendations.map(async (rec) => {
        const animeId = rec.entry.mal_id;
        const cacheKey = `rec_${animeId}`;
        
        // Check cache first
        const cachedData = recommendedAnimeCache.get(cacheKey);
        if (cachedData && now - cachedData.timestamp < CACHE_EXPIRY) {
          return cachedData.data;
        }
        
        // Fetch from API if not in cache
        try {
          const response = await getAnimeById(animeId);
          if (response?.data?.data) {
            const animeData = response.data.data;
            
            // Cache the data
            recommendedAnimeCache.set(cacheKey, {
              data: animeData,
              timestamp: now
            });
            
            return animeData;
          }
        } catch (err) {
          console.error(`Error fetching details for anime ${animeId}:`, err);
          // Return the basic data we already have
          return {
            ...rec.entry,
            type: rec.entry.type || 'Unknown',
            episodes: rec.entry.episodes || null,
            synopsis: 'No description available'
          };
        }
      });
      
      // Wait for all promises to resolve
      const results = await Promise.all(promises);
      setRecommendedAnimeDetails(results.filter(Boolean));
    } catch (err) {
      console.error('Error fetching recommended anime details:', err);
    } finally {
      setRecommendationsLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }
  
  if (error || !anime) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-400 mb-4">{error || "Anime not found"}</div>
        <Button 
          onClick={() => navigate(-1)} 
          variant="outlined"
        >
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-900">
      <div className="relative">
        {anime.images?.jpg?.large_image_url && (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <img 
                src={anime.images.jpg.large_image_url} 
                alt={anime.title}
                className="w-full h-full object-cover filter blur-md opacity-30"
                style={{ objectPosition: 'center 30%' }}
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900"></div>
            </div>
          </>
        )}
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 pt-8 md:pt-16">
            <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 flex flex-col items-center md:items-start">
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg max-w-xs w-full">
                <img 
                  src={anime.images?.jpg?.large_image_url || "https://via.placeholder.com/350x500?text=No+Image"} 
                  alt={anime.title}
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start w-full">
                <LibraryControls anime={anime} />
                <Button 
                  onClick={() => navigate(-1)}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Go Back
                </Button>
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 text-center md:text-left">
                {anime.title}
              </h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <h2 className="text-lg sm:text-xl text-gray-400 mb-4 text-center md:text-left">{anime.title_english}</h2>
              )}
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 mb-6">
                {anime.score && (
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    {anime.score.toFixed(1)}
                  </span>
                )}
                <span className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-sm">
                  {anime.type || "Unknown Type"}
                </span>
                <span className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-sm">
                  {anime.status || "Unknown Status"}
                </span>
                {anime.episodes && (
                  <span className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-sm">
                    {anime.episodes} episodes
                  </span>
                )}
                {anime.duration && (
                  <span className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-sm">
                    {anime.duration}
                  </span>
                )}
                {anime.rating && (
                  <span className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-sm">
                    {anime.rating}
                  </span>
                )}
              </div>
              
              {anime.genres && anime.genres.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {anime.genres.map(genre => (
                      <span
                        key={genre.mal_id}
                        onClick={() => navigate(`/browse?genres=${genre.mal_id}`)}
                        className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-blue-500/30 transition"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Synopsis</h3>
                <div className="relative">
                  <p className={`text-gray-300 leading-relaxed ${!expandSynopsis && 'line-clamp-4 sm:line-clamp-5 md:line-clamp-none'}`}>
                    {anime.synopsis || "No synopsis available."}
                  </p>
                  {anime.synopsis && anime.synopsis.length > 300 && (
                    <button 
                      className="text-blue-400 hover:text-blue-300 mt-2 sm:hidden"
                      onClick={() => setExpandSynopsis(!expandSynopsis)}
                    >
                      {expandSynopsis ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>
              </div>
              
              {anime.trailer?.embed_url && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Trailer</h3>
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <iframe 
                      src={anime.trailer.embed_url} 
                      title={`${anime.title} Trailer`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {characters.length > 0 && (
        <section className="py-8 md:py-12 container mx-auto px-4">
          <SectionTitle title="Characters" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6 mt-6">
            {characters.slice(0, 12).map((charData) => (
              <CharacterCard 
                key={charData.character.mal_id} 
                character={{
                  ...charData.character,
                  role: charData.role,
                  favorites: charData.favorites
                }} 
              />
            ))}
          </div>
        </section>
      )}
      
      {(recommendations.length > 0 || recommendedAnimeDetails.length > 0) && (
        <section className="py-8 md:py-12 bg-gray-800/30 container mx-auto px-4">
          <SectionTitle title="You May Also Like" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6 mt-6">
            {recommendationsLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : recommendedAnimeDetails.length > 0 ? (
              recommendedAnimeDetails.map((animeData) => (
                <div 
                  key={animeData.mal_id}
                  onClick={() => navigate(`/anime/${animeData.mal_id}`)}
                  className="cursor-pointer"
                >
                  <AnimeCard anime={animeData} />
                </div>
              ))
            ) : (
              recommendations.slice(0, 6).map((rec) => (
                <div 
                  key={rec.entry.mal_id}
                  onClick={() => navigate(`/anime/${rec.entry.mal_id}`)}
                  className="cursor-pointer"
                >
                  <AnimeCard anime={{
                    ...rec.entry,
                    type: rec.entry.type || 'TV',
                    episodes: rec.entry.episodes || null,
                    synopsis: rec.entry.synopsis || 'No description available'
                  }} />
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AnimeDetailPage;