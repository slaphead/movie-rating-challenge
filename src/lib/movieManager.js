const _ = require('lodash');
const db = require('./dynamodb');
const theMovieDb = require('./theMovieDb');
const { createError } = require('../utils/common');

const updateMovieRating = async (params) => {
  const { username, rating, movieId } = params;
  const user = await db.getUser(username);

  if (!user) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request: username not found',
    });
  }

  const movie = _.find(user.movies, { id: movieId });
  const getMovieResponse = await theMovieDb.getMovie(movieId);

  if (movie) {
    user.movies.map((item) => {
      const thisItem = item;
      if (thisItem.id === movieId) {
        thisItem.rating = rating;
      }
      return thisItem;
    });
  } else if (user.movies) {
    user.movies.push({ id: movieId, rating, title: _.get(getMovieResponse, 'data.title') });
  } else {
    user.movies = [{ id: movieId, rating, title: _.get(getMovieResponse, 'data.title') }];
  }
  return db.updateMovies({ username, movies: user.movies });
};

module.exports = {
  updateMovieRating,
};
