'use strict'

module.exports = async function (fastify, opts) {
    fastify.get('/', async function (request, reply) {
        let { teams, totalPoints } = fastify.teamsData;
        return reply.view("/index.ejs", { 
            isLogged: (request.session.authenticated ? true : false), 
            isVoted: (request.session.authenticated ? request.session.data.isVoted : false), 
            title: "Marble League Odds",
            teams,
            totalPoints,
            votes: fastify.votesData
        });
    })

    fastify.get('/email', async function (request, reply) {
        return reply.view("/email.ejs", { title: "Marble League Odds - Email" });
    })

    fastify.get('/login', async function (request, reply) {
        if(!request.session.authenticated) return reply.view("/login.ejs", { title: "Marble League Odds - Login" });
        else return reply.redirect('/');
    })

    fastify.get('/register', async function (request, reply) {
        if(!request.session.authenticated) return reply.view("/register.ejs", { title: "Marble League Odds - Register" });
        else return reply.redirect('/');
    })
}