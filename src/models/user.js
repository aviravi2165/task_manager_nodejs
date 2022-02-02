const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim:true
    },
    contact: {
        type: Number,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim:true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("Invalid Email Address!");
        }
    },
    password: {
        type: String,
        required: true,
        trim:true
    }
});

module.exports = User;
