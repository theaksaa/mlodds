'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
    fastify.addSchema({
        $id: 'registerSchema',
        type: 'object',
        required: [ "username", "email", "password" ],
        additionalProperties: false,
        properties: {
            username: {
                type: "string",
                // minLength: 3,
                maxLength: 32,
                // pattern: "^[a-zA-Z0-9]+$"
            },
            email: {
                type: "string",
                format: "email",
                minLength: 6,
                maxLength: 127
            },
            password: {
                type: "string",
                maxLength: 64
                // pattern: "^([a-zA-Z0-9!@#$_]+){6,}.$"
            }
        }
    });
})