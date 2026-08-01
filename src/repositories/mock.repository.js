const User = require('../models/user.model');
const Order = require('../models/order.model');
const Delivery = require('../models/delivery.model');


class MockRepository {
  async insertUsers(docs) {
    return User.insertMany(docs);
  }

  async insertOrders(docs) {
    return Order.insertMany(docs);
  }

  async insertDeliveries(docs) {
    return Delivery.insertMany(docs);
  }

  async findUsersByRole(role, limit) {
    return User.find({ role, isDeleted: false }).select('-password -__v').limit(limit).lean();
  }

  async findOrders(limit) {
    return Order.find({ isDeleted: false }).limit(limit).lean();
  }
}

module.exports = new MockRepository();
