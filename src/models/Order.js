const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  restaurant: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  menuItems: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Menu",
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["visa", "mastercard"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Placed", "In Progress", "Delivered", "Cancelled"],
    default: "Placed",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  isRated: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
