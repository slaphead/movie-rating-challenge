const axios = require('axios');
const { theMovieDbApiKey } = require('../configs/secrets');

const BASE_URL = 'https://api.themoviedb.org';

const searchForMovies = async (searchTerm) => {
  const searchUrl = `${BASE_URL}/3/search/movie`;
  const config = {
    params: {
      api_key: theMovieDbApiKey,
      query: searchTerm,
    },
  };
  return axios.get(searchUrl, config);
};

module.exports = {
  searchForMovies,
};
