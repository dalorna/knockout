const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pickSchema = new Schema({
    userId: { type: String, required: true },
    weekId: { type: Number, required: true},
    leagueSeasonId: { type: String, required: true },
    locked: { type: Boolean, default: false},
    dateLocked: Date,
    gameId: { type: String, required: true },
    teamId: { type: String, required: true},
    scoreDifferential: Number,
    win: Boolean, //0 for lose, 1 for win
    points: Number,
    processed: Boolean
})

module.exports = mongoose.model('Pick', pickSchema);