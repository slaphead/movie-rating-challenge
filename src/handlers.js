const _ = require('lodash');
const withMiddleware = require('./utils/middleware');
const { createError } = require('./utils/common');
const theMovieDb = require('./lib/theMovieDb');

/**
 * Searches for a movie based on the string passed in from the body
 * The search string is required
 * @param {Object} event
 */
const searchMovies = async (event) => {
  const movieName = _.get(event, 'body.name');

  if (!movieName) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request: name required',
    });
  }

  try {
    const response = await theMovieDb.searchForMovies(movieName);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.log(error); // Log the full error to the console for troublehsooting.
    throw createError({
      statusCode: 500,
      message: `Internal error: ${error.message}`,
    });
  }
};

/**
 * Using a movie id, get details of it
 * @param {Object} event
 */
const getMovieDetails = async (event) => {
  const movieId = _.get(event, 'pathParameters.movieId');

  try {
    const response = await theMovieDb.getMovie(movieId);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.log(error); // Log the full error to the console for troublehsooting.
    throw createError({
      statusCode: 500,
      message: `Internal error: ${error.message}`,
    });
  }
};

module.exports = {
  searchMovies: withMiddleware(searchMovies),
  getMovieDetails: withMiddleware(getMovieDetails),
};
