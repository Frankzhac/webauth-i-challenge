const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');


// ENDPOINTS BEGINS HERE
router.post('/api/register', (req, res) => {
  let user = req.body;
// generate hash from user password
  const hash = bcrypt.hashSync(user.password, 10);

//override the user.password with the hash
user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/api/users', (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('Not allowed to leave')
      } else {
        res.send('Logout successful');
      }
    });
  } else {
    res.end();
  }
});

module.exports = router;
