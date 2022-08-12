const mongoose = require('mongoose');

const item = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    surname: {
        required: true,
        type: String
    },
    ext_id: {
        required: true,
        type: String
    },
    created_at: {
        required: true,
        type: Date,
        default: Date.now
    },
    valid_to: {
        required: true,
        type: Date
    }
})

module.exports = mongoose.model('Item', item)
