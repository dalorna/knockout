const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {type: Number, default: 2001},
        Editor: {type: Number},
        Admin: {type: Number}
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
      type: String,
      required: true
    },
    addressLine1: {type: String},
    addressLine2: {type: String},
    city: {type: String},
    state: {type: String},
    zip: {type: String},
    refreshToken: String
})

module.exports = mongoose.model('User', userSchema);