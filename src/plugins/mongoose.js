'use strict'

const fp = require('fastify-plugin')
const mongoose = require('mongoose')

module.exports = fp(async function (fastify, opts) {
    try {
        const database = await mongoose.connect(fastify.config.MongoDB_URL, {
            useNewUrlParser: true
        })
        fastify.log.info("✅ MongoDB connected");
    }
    catch(err) {
        fastify.log.error(err);
    }
})