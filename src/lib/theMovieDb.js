const axios = require('axios');
const { theMovieDbApiKey } = require('../configs/secrets');

const BASE_URL = 'https://api.themoviedb.org';

const searchForMovies = async (searchTerm, page = 1) => {
  const searchUrl = `${BASE_URL}/3/search/movie`;
  const config = {
    params: {
      api_key: theMovieDbApiKey,
      query: searchTerm,
      page,
    },
  };
  return axios.get(searchUrl, config);
};

const getMovie = async (movieId) => {
  const searchUrl = `${BASE_URL}/3/movie/${movieId}`;
  const config = {
    params: {
      api_key: theMovieDbApiKey,
    },
  };
  return axios.get(searchUrl, config);
};

module.exports = {
  searchForMovies,
  getMovie,
};
