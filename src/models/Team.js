const mongoose = require("mongoose");

const TeamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true,
        default: 0
    },
    prevPosition: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model("teams", TeamSchema);