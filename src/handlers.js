const _ = require('lodash');
const middleware = require('middy');
const { jsonBodyParser } = require('middy/middlewares');
const { validateAuthKey, makeError } = require('./utils/common');
const theMovieDb = require('./lib/theMovieDb');

/**
 * Searches for a movie based on the string passed in from the body
 * The search string is required
 * @param {Object} event
 */
const searchMovies = async (event) => {
  const movieName = _.get(event, 'body.name');

  if (!movieName) {
    throw makeError({
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
    throw makeError({
      statusCode: 500,
      message: `Internal error: ${error.message}`,
    });
  }
};

module.exports = {
  searchMovies: middleware(searchMovies).before((handler, next) => {
    validateAuthKey(_.get(handler, 'event.headers.Authorization'));
    next();
  }).use(jsonBodyParser()),
};
