const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const seasonSchema = new Schema({
    year: Number,
    isCurrent: {type: Boolean, default: false},
    weeks: [
        {
            name: String,
            id: Number,
            isCurrent: {type: Boolean, default: false}
        }
    ]
});

module.exports = mongoose.model('Season', seasonSchema);