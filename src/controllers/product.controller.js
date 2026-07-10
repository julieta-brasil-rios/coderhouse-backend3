const productService = require('../services/product.service');
const { HTTP_STATUS } = require('../constants');

/**
 * ProductController
 *acá solo se traduce a HTTP.
 */
class ProductController {
  async getAll(req, res, next) {
    try {
      const onlyAvailable = req.query.available === 'true';
      const products = await productService.getAll({ onlyAvailable });
      res.status(HTTP_STATUS.OK).json({ ok: true, data: products });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await productService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ ok: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json({ ok: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ ok: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      await productService.remove(req.params.id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
