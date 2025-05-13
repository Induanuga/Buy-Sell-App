const mongoose = require('mongoose');

const connectToMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Db', {
        });
        console.log('Connected to MongoDB successfully');
    }
    catch (error) {
        console.log('Error connecting to MongoDB: ', error.message);
    }
};

module.exports = connectToMongoDB;