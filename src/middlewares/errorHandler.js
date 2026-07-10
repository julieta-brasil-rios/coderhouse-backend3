const { HTTP_STATUS } = require('../constants');
const config = require('../config/env.config');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_ERROR;

  const response = {
    ok: false,
    message: err.message || 'Error interno del servidor',
  };

  // Solo mostramos el stack en desarrollo, nunca en producción.
  if (!config.isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
