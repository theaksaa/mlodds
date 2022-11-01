'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
    fastify.addSchema({
        $id: 'loginSchema',
        type: 'object',
        required: [ "username", "password" ],
        additionalProperties: false,
        properties: {
            username: {
                type: "string",
                minLength: 3,
                maxLength: 32,
                pattern: "^[a-zA-Z0-9]+$"
            },
            password: {
                type: "string",
                maxLength: 64,
                pattern: "^([a-zA-Z0-9!@#$_]+){6,}.$"
            }
        }
    });
})