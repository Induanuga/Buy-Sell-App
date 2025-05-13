const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    amount: { type: Number, required: true },
    hashedOTP: { type: String },
    isCompleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Order', orderSchema);