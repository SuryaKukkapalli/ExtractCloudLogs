
const Raven = require('raven');

const createSuccessResponse = (body) => createResponse(200, body);

const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
});

Raven.config({ environment: process.env.DEPLOYMENT_STAGE }).install();

const sendError = (error, logger) => {
  const response = {};
  if (logger) logger.error('HTTP 500 ERROR', error);
  response.statusCode = error.statusCode || 500;
  response.headers = {
    'Access-Control-Allow-Origin': '*',
  };
  response.body = error.message
    ? JSON.stringify(error)
    : JSON.stringify({
        message: 'Internal Server Error',
        ...error,
      });
  return response;
};

module.exports = {
  createSuccessResponse,
  createResponse,
  sendError,
};