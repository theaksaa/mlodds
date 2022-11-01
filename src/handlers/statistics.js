'use strict'

const fp = require('fastify-plugin')
const User = require("../models/User");

module.exports = fp(async function (fastify, opts) {
    fastify.decorate('getVotes', async function() {
        let rawData = await User.find({ isVoted: true });
        return rawData.length;
    });

    fastify.decorate('votesData', 0);

    fastify.decorate('refreshVotesData', async () => {
        fastify.votesData = await fastify.getVotes();
    });

    fastify.votesData = fastify.refreshVotesData();
})