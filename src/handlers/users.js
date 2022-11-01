'use strict'

const fp = require('fastify-plugin')
const mongoose = require('mongoose');

module.exports = fp(async function (fastify, opts) {
    fastify.decorate('saveUserVotes', async (user, votes) => {
        user.lastActivity = Date.now();
        user.isVoted = true;

        let votesArray = [];
        for(let vote of votes) {
            votesArray.push({
                teamId: mongoose.Types.ObjectId(vote.id),
                points: vote.value
            });
        }
        user.votes.push(votesArray);
        await user.save();
    });
})