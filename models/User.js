// imports
const mongoose = require('mongoose');

// User Schema for MongoDB
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        requried: true
    },
    email: {
        type: String,
        requried: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// exports
module.exports = User = mongoose.model('user', UserSchema);