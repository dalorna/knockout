const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leagueSeasonSchema = new Schema({
    seasonId: {type: String, required: true},
    leagueId: {type: String, required: true},
    privateCode: {type: String},
    locked: {type: Boolean, default: false},
    rules: {
        canSeePick: { type: Boolean, default: false},
        gameType: { type: String, default: "survivor"},
        elimination: { type: String, default: "hardCore"},
        ties: { type: Boolean, default: true},
        earlyPoint: { type: Boolean, default: false},
        cantPickSame: {type: Boolean, default: false}
    },
    members: [{userId: String, username: String}],
    maxMembers: {type: Number, default: 25, max: 100}
})

module.exports = mongoose.model('LeagueSeason', leagueSeasonSchema);
