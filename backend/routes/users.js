const express = require('express');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMW');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Review = require('../models/Review');


router.get('/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate({
            path: 'sellerReviews',
            populate: {
                path: 'buyerId',
                select: 'firstName lastName', // Populate fields you need from the User
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...userData } = user.toObject();
        res.status(200).json({ user: userData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
});

router.put('/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: req.body },
            { new: true, runValidators: true }
        )
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }
        const { password, ...userData } = updatedUser.toObject();
        res.status(200).json({ message: "User updated Successfully", user: userData });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
});

router.put('/:userId/password', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const { oldPassword, password } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid old password' });
        }


        const hashedPassword = await bcrypt.hash(password, 11);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { password: hashedPassword } },
            { new: true, runValidators: true }
        )
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Error updating password' });
    }
});

router.put('/:userId/cart/add', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const { itemId } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { cart: itemId } },
            { new: true, runValidators: true }
        ).populate('cart', 'name price description category sellerId');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...userData } = updatedUser.toObject();
        res.status(200).json({ message: 'Item added to cart', user: userData });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
});

router.put('/:userId/cart/remove', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const { itemId } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: itemId } },
            { new: true, runValidators: true }
        ).populate('cart', 'name price description category sellerId');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...userData } = updatedUser.toObject();
        res.status(200).json({ message: 'Item removed from cart', user: userData });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
});

router.get('/:userId/cart', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('cart', 'name price description category sellerId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...userData } = user.toObject();
        res.status(200).json({ cart: userData.cart });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user cart', error: error.message });
    }
});

router.get('/:userId/reviews', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate({
            path: 'sellerReviews',
            populate: {
                path: 'buyerId',
                select: 'firstName lastName'
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ reviews: user.sellerReviews });
    } catch (error) {
        console.error('Error fetching seller reviews:', error);
        res.status(500).json({ message: 'Error fetching seller reviews' });
    }
});


router.post('/:sellerId/reviews', authenticateToken, async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const buyerId = req.user.userId;
        const { itemId, comment, rating } = req.body;

        const existingReview = await Review.findOne({
            buyerId,
            sellerId,
            itemId,
        });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this seller for this item." });
        }

        const newReview = new Review({
            buyerId,
            sellerId,
            itemId,
            comment,
            rating,
        });
        await newReview.save();
        const updatedSeller = await User.findByIdAndUpdate(sellerId, {
            $push: { sellerReviews: newReview._id },
        }, { new: true });

        if (!updatedSeller) {
            return res.status(404).json({ message: 'Seller not found' })
        }


        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
});


module.exports = router;