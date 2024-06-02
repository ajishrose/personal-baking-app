const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bakingOrderSchema = new Schema({
  name: { type: String, required: true },
  baked_good: { type: String, required: true },
  flavor: { type: String, required: true },
  quantity: { type: Number, required: true },
  event_date: { type: Date, required: true },
}, {
  timestamps: true,
});

const BakingOrder = mongoose.model('Baking Order', bakingOrderSchema);

module.exports = BakingOrder;