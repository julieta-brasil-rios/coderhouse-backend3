const Product = require('../models/product.model');

/**
 * ProductRepository
 * Acá viven los filtros por defecto (ej. no traer productos borrados)
 */
class ProductRepository {
  //Trae productos aplicando siempre el filtro de "no borrados" 
  
  async findAll(extraFilter = {}) {
    return Product.find({ isDeleted: false, ...extraFilter })
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();
  }

  async findById(id) {
    return Product.findOne({ _id: id, isDeleted: false }).select('-__v').lean();
  }

  async create(data) {
    const product = new Product(data);
    await product.save();
    return product.toObject();
  }

  async updateById(id, data) {
    return Product.findOneAndUpdate({ _id: id, isDeleted: false }, data, {
      new: true,
      runValidators: true,
    })
      .select('-__v')
      .lean();
  }


   // solo lo marcamos como borrado para no perder historial.
  
  async softDeleteById(id) {
    return Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    )
      .select('-__v')
      .lean();
  }

  async existsByName(name) {
    const found = await Product.findOne({ name, isDeleted: false }).select('_id').lean();
    return Boolean(found);
  }
}

module.exports = new ProductRepository();
