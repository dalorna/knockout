const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leagueSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
})

module.exports = mongoose.model('League', leagueSchema);