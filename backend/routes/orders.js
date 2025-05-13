const express = require('express');
const Order = require('../models/Order');
const authenticateToken = require('../middleware/authMW');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const router = express.Router();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { itemId, amount, sellerId } = req.body;
        const buyerId = req.user.userId;
        const transactionId = crypto.randomBytes(16).toString('hex');
        const otp = generateOTP();
        const hashedOTP = await bcrypt.hash(otp, 11);
        const newOrder = new Order({
            transactionId: transactionId,
            buyerId: buyerId,
            sellerId: sellerId,
            itemId: itemId,
            amount: amount,
            hashedOTP: hashedOTP,
        });
        await newOrder.save();
        res.status(201).json({
            message: 'Order placed successfully',
            order: {
                ...newOrder.toObject(),
                otp: otp
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
});

router.put('/:orderId/regenerate-otp', authenticateToken, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const userId = req.user.userId;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.buyerId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to re-generate otp" });
        }
        const otp = generateOTP();
        const hashedOTP = await bcrypt.hash(otp, 11);
        order.hashedOTP = hashedOTP;
        await order.save();
        res.status(200).json({ message: 'OTP re-generated successfully', otp: otp });

    } catch (error) {
        res.status(500).json({ message: 'Error regenerating OTP', error: error.message });
    }
});

router.put('/:orderId/complete', authenticateToken, async (req, res) => {
    try {
        const { otp } = req.body;
        const orderId = req.params.orderId;
        const userId = req.user.userId;
        const order = await Order.findById(orderId).populate('buyerId', 'firstName lastName')
            .populate('itemId', 'name price');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.sellerId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to complete this transaction" });
        }
        const otpMatch = await bcrypt.compare(otp, order.hashedOTP);
        if (!otpMatch) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        order.isCompleted = true;
        await order.save();
        res.status(200).json({ message: 'Transaction closed successfully', order: order });
    } catch (error) {
        res.status(500).json({ message: 'Error completing order', error: error.message });
    }
});

router.get('/user', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const boughtOrders = await Order.find({ buyerId: userId, isCompleted: true }).populate('itemId', 'name price').populate('sellerId', 'firstName lastName');
        const soldOrders = await Order.find({ sellerId: userId, isCompleted: true }).populate('itemId', 'name price').populate('buyerId', 'firstName lastName');
        res.status(200).json({ boughtOrders: boughtOrders, soldOrders: soldOrders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

router.get('/pending', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const pendingBuyerOrders = await Order.find({ buyerId: userId, isCompleted: false })
            .populate('itemId', 'name price')
            .populate('sellerId', 'firstName lastName');
        const pendingSellerOrders = await Order.find({ sellerId: userId, isCompleted: false })
            .populate('itemId', 'name price')
            .populate('buyerId', 'firstName lastName');

        const pendingBuyerOrdersWithOTP = pendingBuyerOrders.map((order) => {
            return {
                ...order.toObject(),

            };
        });
        res.status(200).json({
            pendingBuyerOrders: pendingBuyerOrdersWithOTP,
            pendingSellerOrders: pendingSellerOrders
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending orders', error: error.message });
    }
});

module.exports = router;