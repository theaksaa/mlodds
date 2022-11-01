const { ObjectId } = require("@fastify/mongodb");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    lastActivity: {
        type: Date,
        required: true,
        default: Date.now()
    },
    image: {
        type: String,
        required: false,
        default: null
    },
    isVerificated: {
        type: Boolean,
        required: true,
        default: false
    },
    isVoted: {
        type: Boolean,
        required: true,
        default: false
    },
    votes: [
        [ {
            teamId: {
                type: ObjectId,
                required: true
            },
            points: {
                type: Number,
                required: true,
                default: 0
            },
            date: {
                type: Date,
                required: true,
                default: Date.now()
            }
        } ]
    ],
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model("users", UserSchema);