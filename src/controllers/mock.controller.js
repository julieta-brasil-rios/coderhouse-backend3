const mockService = require('../services/mock.service');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS, ROLES } = require('../constants');

const VALID_SEED_COLLECTIONS = ['users', 'orders', 'deliveries'];
const MOCKABLE_ROLES = [ROLES.USER, ROLES.REPARTIDOR];

function parseQty(raw, { fallback = 5, max = 50 } = {}) {
  const qty = Number(raw);
  if (!Number.isInteger(qty) || qty <= 0) return fallback;
  return Math.min(qty, max);
}


class MockController {
  previewUsers(req, res, next) {
    try {
      const qty = parseQty(req.query.qty);
      const role = MOCKABLE_ROLES.includes(req.query.role) ? req.query.role : undefined;
      const data = mockService.previewUsers(qty, role);
      res.status(HTTP_STATUS.OK).json(data);
    } catch (err) {
      next(err);
    }
  }

  previewOrders(req, res, next) {
    try {
      const qty = parseQty(req.query.qty);
      const data = mockService.previewOrders(qty);
      res.status(HTTP_STATUS.OK).json(data);
    } catch (err) {
      next(err);
    }
  }

  previewDeliveries(req, res, next) {
    try {
      const qty = parseQty(req.query.qty);
      const data = mockService.previewDeliveries(qty);
      res.status(HTTP_STATUS.OK).json(data);
    } catch (err) {
      next(err);
    }
  }

  async seed(req, res, next) {
    try {
      const qty = parseQty(req.query.qty, { fallback: 10, max: 200 });
      const collection = VALID_SEED_COLLECTIONS.includes(req.query.collection)
        ? req.query.collection
        : 'users';
      const result = await mockService.seed(collection, qty);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }

  async seedCollection(req, res, next) {
    try {
      const qty = parseQty(req.query.qty, { fallback: 10, max: 200 });
      const { collection } = req.params;
      if (!VALID_SEED_COLLECTIONS.includes(collection)) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Colección "${collection}" inválida.`);
      }
      const result = await mockService.seed(collection, qty);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MockController();
