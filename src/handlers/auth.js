'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
    fastify.decorate('isLogged', function(request, reply, done) {
        if(request.session.authenticated) done()
        else done(new Error('Not logged'))
    });
    
    fastify.decorate('isNotLogged', function(request, reply, done) {
        if(!request.session.authenticated) done()
        else done(new Error('Logged'))
    });

    fastify.decorate('isAdmin', async function(request, reply) {
        try {
            if(request.session.authenticated && request.session.data.isAdmin == true) {
                let user = await User.findOne({ username: request.session.data.username, isAdmin: true });
                
                if(user) done()
                else throw new Error('Not admin')
            }
            else throw new Error('Not logged')
        }
        catch(err) {
            throw new Error('Invalid session')
        }
    });
})