const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /@iiit\.ac\.in$/ },
    age: { type: Number, required: true },
    contactNumber: { type: String, required: true },
    password: { type: String, required: true },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    sellerReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});

// (middleware fn) before saving, hash the password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 11);
    next();
});

module.exports = mongoose.model('User', userSchema);
