const { movieChallengeApiKey } = require('../configs/secrets');

const makeError = ({ statusCode, message, cause }) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.message = message;
  error.cause = cause;

  return error;
};

const validateAuthKey = (key) => {
  if (key !== movieChallengeApiKey) {
    throw makeError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
};

module.exports = {
  validateAuthKey,
  makeError,
};
