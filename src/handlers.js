const _ = require('lodash');
const withMiddleware = require('./utils/middleware');
const { createError, validateEmail } = require('./utils/common');
const theMovieDb = require('./lib/theMovieDb');
const { updateMovieRating } = require('./lib/movieManager');
const db = require('./lib/dynamodb');

/**
 * Searches for a movie based on the string passed in from the body
 * The search string is required
 * @param {Object} event
 */
const searchMovies = async (event) => {
  const movieName = _.get(event, 'queryStringParameters.name');
  const page = _.get(event, 'queryStringParameters.page');

  if (!movieName) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request: name required',
    });
  }

  try {
    const response = await theMovieDb.searchForMovies(movieName, page);

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

/**
 * Create a new user
 * @param {Object} event
 */
const createMovieUser = async (event) => {
  const email = _.get(event, 'body.email');
  const username = _.get(event, 'body.username');

  if (!email || !username) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request: required fields missing',
    });
  }

  if (!validateEmail(email)) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request: invalid email format',
    });
  }

  try {
    const userData = { email, username };
    await db.createUser(userData);

    return {
      statusCode: 200,
      body: JSON.stringify(userData),
    };
  } catch (error) {
    console.log(error); // Log the full error to the console for troublehsooting.
    // TODO Clean up custom error handling
    if (error.message === 'The conditional request failed') {
      throw createError({
        statusCode: 409,
        message: `Conflict: username already exists: ${username}`,
      });
    }
    throw createError({
      statusCode: 500,
      message: `Internal error: ${error.message}`,
    });
  }
};

/**
 * Get a user
 * @param {Object} event
 */
const getMovieUser = async (event) => {
  const username = _.get(event, 'queryStringParameters.username');

  if (!username) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request: username required',
    });
  }

  try {
    const response = await db.getUser(username);

    return {
      statusCode: 200,
      body: JSON.stringify(response || 'Username not found'),
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
 * Allows a user to rate a movie using the movie id. It will store this rating with the user in the db along with the movie id and the name of the movie
 * Hypothetical is the user has been signed in to use this endpoint beyond doing basic authorization
 * @param {Object} event
 */
const rateMovie = async (event) => {
  const username = _.get(event, 'body.username');
  const rating = _.get(event, 'body.rating');
  const movieId = _.get(event, 'pathParameters.movieId');

  if (!username || !rating) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request: missing required fields',
    });
  }

  // TODO Better rating validation
  if (rating < 0 || rating > 10) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request: rating must be between 0 and 10',
    });
  }

  try {
    const update = await updateMovieRating({ username, rating, movieId });

    return {
      statusCode: 200,
      body: JSON.stringify(update),
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
  createMovieUser: withMiddleware(createMovieUser),
  getMovieUser: withMiddleware(getMovieUser),
  rateMovie: withMiddleware(rateMovie),
};
