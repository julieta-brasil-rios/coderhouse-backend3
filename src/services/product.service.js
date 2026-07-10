const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS, PRODUCT_STATUS } = require('../constants');

/**
 * ProductService
 * Acá vive TODA la lógica de negocio de productos:
 * - decidir el "status" según el stock,
 * - validar duplicados,
 * - calcular precios/descuentos,
 * - decidir qué se considera "no encontrado".
 */
class ProductService {
  async getAll({ onlyAvailable } = {}) {
    const filter = onlyAvailable ? { status: PRODUCT_STATUS.AVAILABLE } : {};
    return productRepository.findAll(filter);
  }

  async getById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `No existe un producto con id "${id}"`);
    }
    return product;
  }

  async create(data) {
    const alreadyExists = await productRepository.existsByName(data.name);
    if (alreadyExists) {
      throw new ApiError(HTTP_STATUS.CONFLICT, `Ya existe un producto llamado "${data.name}"`);
    }

    const status = this._resolveStatusFromStock(data.stock);

    return productRepository.create({ ...data, status });
  }

  async update(id, data) {
    // Si viene stock nuevo, recalculamos automáticamente
    const payload = { ...data };
    if (typeof data.stock === 'number') {
      payload.status = this._resolveStatusFromStock(data.stock);
    }

    const updated = await productRepository.updateById(id, payload);
    if (!updated) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `No existe un producto con id "${id}"`);
    }
    return updated;
  }

  async remove(id) {
    const deleted = await productRepository.softDeleteById(id);
    if (!deleted) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `No existe un producto con id "${id}"`);
    }
    return deleted;
  }

  _resolveStatusFromStock(stock) {
    if (stock <= 0) return PRODUCT_STATUS.OUT_OF_STOCK;
    return PRODUCT_STATUS.AVAILABLE;
  }
}

module.exports = new ProductService();
