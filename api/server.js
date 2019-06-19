const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);


const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
  name: 'lightsaber', // defaults to sid but it will reveal our stack
  secret: 'Monkey footballer, hello world', // use to encrypt/decrypt the cookie
  cookie: {
    maxAge: 1000 * 60 * 60, // how long the session is valid for in ms (millisec)
    secure: false, // should be true in production. In use with https
    httpOnly: true // prevents Javascript access in browser
  },
  resave: false, // avoid cookie duplications
  saveUninitialized: true, // GDPR laws against setting cookies automatically, has to be false in production

  // add this to configure the way sessions are stored
  store: new KnexSessionStore({
    knex: require('../data/dbConfig'),
    tableName: 'sessions', // if table that will store sessions inside your db
    sidfieldname: 'sid', // column that will hold session id, name it w.e we want
    createTable: true, // if table does not exist, create one for us
    clearInterval: 1000 * 60 * 60 // time it takes to checks old sessions and remove them in the db
  })
};

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);


server.get('/', (req, res) => {
  res.send("It's alive!");
});


module.exports = server;
