const _ = require('lodash');
const middleware = require('middy');
const { jsonBodyParser, httpErrorHandler } = require('middy/middlewares');
const { validateAuthKey } = require('../utils/common');

const withMiddleware = handlerFunction => middleware(handlerFunction)
  .before((handler, next) => {
    validateAuthKey(_.get(handler, 'event.headers.Authorization') || _.get(handler, 'event.headers.authorization'));
    next();
  })
  .use(jsonBodyParser())
  .use(httpErrorHandler());

module.exports = withMiddleware;
