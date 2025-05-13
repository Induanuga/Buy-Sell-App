const express = require('express');
const Item = require('../models/Item');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMW');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const items = await Item.find({ status: 'available' }).populate('sellerId', 'firstName lastName');
        const users = await User.find({}, 'cart');
        const cartItems = users.reduce((acc, user) => {
            return acc.concat(user.cart.map(item => item.toString()))
        }, []);
        const filteredItems = items.filter(item => !cartItems.includes(item._id.toString()));
        res.status(200).json(filteredItems);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching items', error: err.message });
    }
});

router.get('/:itemId', authenticateToken, async (req, res) => {
    try {
        const item = await Item.findById(req.params.itemId).populate('sellerId', 'firstName lastName');
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching item', error: err.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        const sellerId = req.user.userId
        const newItem = new Item({ name, price, description, category, sellerId });
        await newItem.save();
        res.status(201).json({ message: 'Item created successfully', item: newItem });
    } catch (err) {
        res.status(500).json({ message: 'Error creating item', error: err.message });
    }
});


router.put('/:itemId', authenticateToken, async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const { status } = req.body;
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        item.status = status;
        await item.save();
        res.status(200).json({ message: "Item updated successfully", item: item });
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating item', error: err.message });
    }
});

router.delete('/:itemId', authenticateToken, async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        await Item.deleteOne({ _id: itemId });
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: "Error deleting item", error: err.message });
    }
});

module.exports = router;