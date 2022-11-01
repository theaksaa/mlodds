'use strict'

const User = require("../../../models/User");
const bcrypt = require('bcryptjs')

function checkSubmissionData(data) {
    var checkData = {}, checkPoints = {};
    if(data.length != 16) return false;
    for(var x of data) {
        if(x.id in checkData) return false;
        if(x.value in checkPoints) return false;
        checkData[x.id] = x.value;
        checkPoints[x.value] = x.id;
    }
    for(let points of [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 25 ]) {
        if(!(points in checkPoints)) return false;
    }
    return true;
}

module.exports = async function (fastify, opts) {
    fastify.post('/register', { preHandler: fastify.auth([ fastify.isNotLogged ]), schema: { body: { $ref: 'registerSchema#' } } }, async function (request, reply) {
        const { username, email, password } = request.body;
        try {
            const regexUsername = new RegExp('^[a-zA-Z0-9]{3,}$');
            const regexPassword = new RegExp('^[a-zA-Z0-9!@#$_]{6,}$');
            if(!regexUsername.test(username)) return reply.status(401).send(new Error('Username must contain letters, numbers and more than 3 characters'));
            if(!regexPassword.test(password)) return reply.status(401).send(new Error('Password must contain letters, numbers and !, @, #, $, _ and more than 6 characters'));
            if(await User.findOne({ username })) return reply.status(401).send(new Error('Username is already in use'));
            if(await User.findOne({ email })) return reply.status(401).send(new Error('Email is already in use'));

            let hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
            let token = fastify.jwt.sign({ username, email, date: Date.now(), }, {
                expiresIn: '900000'
            });

            let emailText = `<h3>Marble League Odds</h3><br>Hi ${username},<br><br>We're happy you've joined us. To use our website, you'll need to verify your email by clicking <a href="https://marbleleagueodds.com/api/user/activate?username=${username}&token=${token}">here</a>.<br>This link will expire in <b>15 minutes</b>.<br><br><b>Happy voting!</b>`;
            fastify.mailer.sendMail({
                to: email,
                subject: 'Email verification',
                html: emailText
            });

            let user = new User({ username, email, password: hashedPassword, token });
            await user.save();

            return reply.view("/email.ejs", { title: "Marble League Odds - Verification", message: 'Please check your email (spam folder)' });
        }
        catch(err) {
            return reply.status(500).send(new Error('Unexpected error'));
        }
    })

    fastify.post('/login', { preHandler: fastify.auth([ fastify.isNotLogged ]), schema: { body: { $ref: 'loginSchema#' } } }, async function (request, reply) {
        const { username, password } = request.body;
        try {
            let user = await User.findOne({ username });
            if((!user) || (!(await bcrypt.compare(password, user.password)))  || (!user.isVerificated)) return reply.status(401).send(new Error('Invalid credentials'));

            user.lastActivity = Date.now();
            await user.save();

            request.session.authenticated = true;
            request.session.data = {
                userId: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                isVoted: user.isVoted
            };
            return reply.status(200).send({ message: 'Successfully logged in'});
        }
        catch(err) {
            return reply.status(500).send(new Error('Unexpected error'));
        }
    })

    fastify.get('/activate', async function (request, reply) {
        const { username, token } = request.query;
        try {
            let user = await User.findOne({ username, token });

            if((!user) || (user.isVerificated) || (!fastify.jwt.verify(user.token))) return reply.view("/email.ejs", { title: "Marble League Odds - Verification", message: 'Invalid token' });

            user.lastActivity = Date.now();
            user.isVerificated = true;
            await user.save();

            return reply.view("/email.ejs", { title: "Marble League Odds - Login", message: 'Successfully verificated' });
        }
        catch(err) {
            return reply.view("/email.ejs", { title: "Marble League Odds - Verification", message: 'Invalid token' });
        }
    })
    
    fastify.get('/logout', async function (request, reply) {
        try {
            await request.session.destroy();
        }
        catch(err) {
        }
        return reply.redirect('/');
    })

    fastify.post('/submit', { preHandler: fastify.auth([ fastify.isLogged ]) }, async function (request, reply) {
        const points = request.body;
        try {
            let user = await User.findOne({ username: request.session.data.username });
            if((!user) || (user.isVoted)) return reply.status(401).send(new Error('Already voted'));

            if(checkSubmissionData(points)) {
                let votes = {}; 
                for(let point of points) {
                    votes[point.id] = parseInt(point.value);
                }
                
                await fastify.refreshTeamsData(votes);
                await fastify.saveUserVotes(user, points);
                fastify.refreshVotesData();

                request.session.authenticated = true;
                request.session.data = {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    isVoted: user.isVoted
                };
                return reply.status(200).send({ message: 'Successfully voted'});
            }
            return reply.status(401).send(new Error('Error votes'));
        }
        catch(err) {
            return reply.status(500).send(new Error('Unexpected error'));
        }
    })

    fastify.get('/email', async function (request, reply) {
        return reply.view("/email.ejs", { title: "Marble League Odds - Login", message: 'Successfully verificated' });
    })
}