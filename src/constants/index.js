/**
 * src/constants/index.js
 *
 * Diccionario único de valores inmutables del dominio.
 * Nada en el código debería usar los strings "ADMIN", "USER",
 * "AVAILABLE", etc. sueltos: siempre a través de estos objetos.
 */

const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
});

const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  DISCONTINUED: 'DISCONTINUED',
});

const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
});

module.exports = { ROLES, PRODUCT_STATUS, HTTP_STATUS };
