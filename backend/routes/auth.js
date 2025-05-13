const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authMW');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, age, contactNumber, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({
            firstName,
            lastName,
            email,
            age,
            contactNumber,
            password,
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET
        );
        res.status(200).json({ message: 'Logged in successfully', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during login' });
    }
});

module.exports = router;