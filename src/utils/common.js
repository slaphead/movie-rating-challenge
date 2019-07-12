const { movieChallengeApiKey } = require('../configs/secrets');

const createError = ({ statusCode, message }) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

const validateAuthKey = (key) => {
  if (key !== movieChallengeApiKey) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
};

module.exports = {
  validateAuthKey,
  createError,
};
