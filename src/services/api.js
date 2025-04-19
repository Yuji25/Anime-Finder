import axios from 'axios';

const API_BASE_URL = 'https://api.jikan.moe/v4';

class RateLimiter {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.lastRequestTime = 0;
    this.requestHistory = [];
  }

  enqueue(apiCall) {
    return new Promise((resolve, reject) => {
      this.queue.push({ apiCall, resolve, reject });
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    await this.waitForRateLimit();

    const { apiCall, resolve, reject } = this.queue.shift();
    
    try {
      const result = await apiCall();
      this.lastRequestTime = Date.now();
      this.requestHistory.push(this.lastRequestTime);
      
      const minuteAgo = Date.now() - 60000;
      this.requestHistory = this.requestHistory.filter(time => time > minuteAgo);
      
      resolve(result);
    } catch (error) {
      console.error('API Error:', error.message);
      
      if (error.response) {
        console.error('API Response Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
      if (error.response && error.response.status === 429) {
        console.log('Rate limited by the server, waiting longer...');
        this.queue.unshift({ apiCall, resolve, reject });
        await new Promise(r => setTimeout(r, 5000));
      } else if (error.response && error.response.status >= 500) {
        console.log('Server error, retrying in 3 seconds...');
        this.queue.unshift({ apiCall, resolve, reject });
        await new Promise(r => setTimeout(r, 3000));
      } else {
        resolve({ 
          data: { data: [] },
          error: error.response?.data?.message || error.message || 'An error occurred while fetching data'
        });
      }
    }

    setTimeout(() => this.processQueue(), 100);
  }

  async waitForRateLimit() {
    if (this.requestHistory.length >= 60) {
      const oldestAllowed = Date.now() - 60000;
      const oldestRequest = this.requestHistory[0];
      if (oldestRequest > oldestAllowed) {
        const waitTime = oldestRequest + 60000 - Date.now() + 100;
        console.log(`Waiting ${waitTime}ms to respect minute rate limit...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    const timeSinceLastRequest = Date.now() - this.lastRequestTime;
    if (timeSinceLastRequest < 334) {
      const waitTime = 334 - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

const rateLimiter = new RateLimiter();

export const getTopAnime = async (page = 1, limit = 12) => {
  console.log(`Fetching top anime: page=${page}, limit=${limit}`);
  return rateLimiter.enqueue(() => 
    axios.get(`${API_BASE_URL}/top/anime`, {
      params: { page, limit }
    })
  );
};

export const searchAnime = async (query, page = 1, limit = 12) => {
  console.log(`Searching anime: query="${query}", page=${page}, limit=${limit}`);
  return rateLimiter.enqueue(() => 
    axios.get(`${API_BASE_URL}/anime`, {
      params: { q: query, page, limit }
    })
  );
};

export const getAnimeById = async (id) => {
  console.log(`Fetching anime details: id=${id}`);
  return rateLimiter.enqueue(() => 
    axios.get(`${API_BASE_URL}/anime/${id}/full`)
  );
};

export const getAnimeCharacters = async (animeId) => {
  console.log(`Fetching anime characters: animeId=${animeId}`);
  return rateLimiter.enqueue(() => 
    axios.get(`${API_BASE_URL}/anime/${animeId}/characters`)
  );
};

export const getTopCharacters = async (page = 1, limit = 12) => {
  console.log(`Fetching top characters: page=${page}, limit=${limit}`);
  return rateLimiter.enqueue(() => 
    axios.get(`${API_BASE_URL}/top/characters`, {
      params: { page, limit }
    })
  );
};

export const getAnimeByGenre = async (genreIds, page = 1, limit = 12) => {
  console.log(`Fetching anime by genres: genreIds=${genreIds}, page=${page}, limit=${limit}`);
  const genres = Array.isArray(genreIds) ? genreIds.join(',') : genreIds;
  
  return rateLimiter.enqueue(() => 
    axios.get(`${API_BASE_URL}/anime`, {
      params: { genres, page, limit }
    })
  );
};

export const getGenres = async () => {
  console.log('Fetching all genres');
  return rateLimiter.enqueue(() => 
    axios.get(`${API_BASE_URL}/genres/anime`)
  );
};

export const getSeasonalAnime = async (year, season, page = 1, limit = 12) => {
  console.log(`Fetching seasonal anime: year=${year}, season=${season}, page=${page}, limit=${limit}`);
  return rateLimiter.enqueue(() => 
    axios.get(`${API_BASE_URL}/seasons/${year}/${season}`, {
      params: { page, limit }
    })
  );
};

export const getCurrentSeasonAnime = async (page = 1, limit = 12) => {
  console.log(`Fetching current season anime: page=${page}, limit=${limit}`);
  return rateLimiter.enqueue(() => 
    axios.get(`${API_BASE_URL}/seasons/now`, {
      params: { page, limit }
    })
  );
};

export const getAnimeRecommendations = async (animeId) => {
  console.log(`Fetching anime recommendations: animeId=${animeId}`);
  return rateLimiter.enqueue(() => 
    axios.get(`${API_BASE_URL}/anime/${animeId}/recommendations`)
  );
}; 