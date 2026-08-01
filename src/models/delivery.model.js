const mongoose = require('mongoose');
const { DELIVERY_STATUS } = require('../constants');


const deliverySchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    repartidor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
      type: String,
      enum: Object.values(DELIVERY_STATUS),
      default: DELIVERY_STATUS.ASSIGNED,
    },
    estimatedDeliveryDate: { type: Date, required: true },
    deliveredAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    isMock: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);
