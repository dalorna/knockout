const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pickSchema = new Schema({
    userId: { type: String, required: true },
    weekId: { type: Number, required: true},
    leagueSeasonId: { type: String, required: true },
    locked: { type: Boolean, default: false},
    gameId: { type: String, required: true },
    teamId: { type: String, required: true}
})

module.exports = mongoose.model('Pick', pickSchema);