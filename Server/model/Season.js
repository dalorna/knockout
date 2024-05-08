const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const seasonSchema = new Schema({
    year: {type: Number, required: true},
    isCurrent: {type: Boolean, default: false},
    weeks: [
        {
            name: String,
            id: Number,
            isCurrent: {type: Boolean, default: false},
            firstGameDate: Date
        }
    ]
});

module.exports = mongoose.model('Season', seasonSchema);