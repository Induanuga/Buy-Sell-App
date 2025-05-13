const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToMongoDB = require('./config/connectToMongoDB');
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const itemsRoute = require('./routes/items');
const ordersRoute = require('./routes/orders');

dotenv.config();

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

connectToMongoDB();

//Routes
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/items', itemsRoute);  
app.use('/api/orders', ordersRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}...`);
});