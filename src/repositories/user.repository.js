const User = require('../models/user.model');

/**
 * UserRepository
 * Único módulo autorizado a hablar con Mongoose para la User.
 */
class UserRepository {
  async findAll() {
    return User.find({ isDeleted: false }).select('-__v').sort({ createdAt: -1 }).lean();
  }

  async findById(id) {
    return User.findOne({ _id: id, isDeleted: false }).select('-__v').lean();
  }

  
   // Trae el usuario CON password incluido 

  async findByEmailWithPassword(email) {
    return User.findOne({ email, isDeleted: false }).select('+password');
  }

  async findByEmail(email) {
    return User.findOne({ email, isDeleted: false }).select('-__v').lean();
  }

  async create(data) {
    const user = new User(data);
    await user.save();
    const { password, ...safeUser } = user.toObject();
    return safeUser;
  }

  async updateById(id, data) {
    return User.findOneAndUpdate({ _id: id, isDeleted: false }, data, {
      new: true,
      runValidators: true,
    })
      .select('-__v')
      .lean();
  }

  async softDeleteById(id) {
    return User.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    )
      .select('-__v')
      .lean();
  }
}

module.exports = new UserRepository();
