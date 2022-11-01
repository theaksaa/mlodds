'use strict'

const path = require('path')

const AutoLoad = require('@fastify/autoload')
const Env = require('@fastify/env')
const Auth = require('@fastify/auth')
const Session = require('@fastify/session')
const Cookie = require('@fastify/cookie')
const Static = require('@fastify/static')
const View = require('@fastify/view')
const JWT = require('@fastify/jwt')

const MongoStore = require('connect-mongo')

const EJS = require('ejs')
const Mailer = require('fastify-mailer')

module.exports = async function (fastify, opts) {
    fastify.log.warn('===============================================');

    await fastify.register(Env, {
        schema: {
            type: 'object',
            required: [ 'MongoDB_URL', 'MongoStore_URL', 'SessionSecret', 'MongoStoreSecret', 'JWTSecret', 'Email_SERVICE', 'Email_USER', 'Email_PASS' ],
            properties: {
                MongoDB_URL: {
                    type: 'string',
                },
                MongoStore_URL: {
                    type: 'string',
                },
                SessionSecret: {
                    type: 'string',
                },
                MongoStoreSecret: {
                    type: 'string',
                },
                JWTSecret: {
                    type: 'string',
                },
                Email_SERVICE: {
                    type: 'string',
                },
                Email_USER: {
                    type: 'string',
                },
                Email_PASS: {
                    type: 'string',
                },
                PORT: {
                    type: 'string',
                    default: 80
                }
            }
        },
        dotenv: true
    }).after(() => {
        fastify.log.info('✅ Config loaded');
    });

    await fastify.register(Cookie, {}).after(() => {
        fastify.log.info('✅ Cookies loaded');
    });

    await fastify.register(Session, {
        cookieName: 'session',
        secret: fastify.config.SessionSecret,
        cookie: { 
            secure: false,
            maxAge: 1200000
        },
        store: MongoStore.create({
            mongoUrl: fastify.config.MongoStore_URL,
            touchAfter: 1 * 3600,
            crypto: {
                secret: fastify.config.MongoStoreSecret
            }
        })
    }).after(() => {
        fastify.log.info('✅ Session loaded');
    });

    await fastify.register(JWT, {
        secret: fastify.config.JWTSecret
    }).after(() => {
        fastify.log.info('✅ JWT loaded');
    });

    await fastify.register(Mailer, {
        defaults: {
            from: 'Marble League Odds <' + fastify.config.Email_USER + '>'
        },
        transport: {
            service: fastify.config.Email_SERVICE,
            auth: {
                user: fastify.config.Email_USER,
                pass: fastify.config.Email_PASS
            },
            tls: {
                ciphers: 'SSLv3'
            }
        }
    }).after(() => {
        fastify.log.info('✅ Nodemailer loaded');
    });

    await fastify.register(Auth, {
    }).after(() => {
        fastify.log.info('✅ Auth loaded');
    });

    await fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: Object.assign({}, opts)
    }).after(() => {
        fastify.log.info('✅ Plugins loaded');
    });

    await fastify.register(Static, {
        root: path.join(__dirname, 'public'),
        prefix: '/public/'
    }).after(() => {
        fastify.log.info('✅ Public folder loaded');
    });

    await fastify.register(View, {
        engine: {
            ejs: EJS,
        },
        root: path.join(__dirname, "views"),
    }).after(() => {
        fastify.log.info('✅ Views loaded');
    });

    await fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'handlers'),
        options: Object.assign({}, opts)
    }).after(() => {
        fastify.log.info('✅ Handlers loaded');
    });

    await fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'schemas'),
        options: Object.assign({}, opts)
    }).after(() => {
        fastify.log.info('✅ Schemas loaded');
    });

    await fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: Object.assign({}, opts)
    }).after(() => {
        fastify.log.info('✅ Routes loaded');
    });
}

module.exports.options = {
    logger: {
        level: 'info',
        file: '/var/log/web/logs'
    }
}