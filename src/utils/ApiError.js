/**
 * Error de negocio con status code HTTP asociado.
 * Los Services lanzan esto; el Controller solo lo traduce a respuesta HTTP.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

module.exports = ApiError;
