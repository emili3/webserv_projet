var express = require('express');
var router = express.Router();
const User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
User.find().sort('username').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

/* GET user by username */

router.get('/:username', loadUser, function(req, res, next) {
 res.send(req.user);
});

/* POST new user */
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newUser = new User(req.body);
  // Save that document
  newUser.save(function(err, savedUser) {
    if (err) {
      return next(err);
    }
    // Send the saved document in the response
    res.send(savedUser);
  });
});

/* PATCH update user */
router.patch('/:username', loadUser, function(req, res, next) {

  // Update properties present in the request body
  if (req.body.username !== undefined) {
    req.user.username = req.body.username;
  }
  if (req.body.firstName !== undefined) {
    req.user.firstName = req.body.firstName;
  }
  if (req.body.lastName !== undefined) {
    req.user.lastName = req.body.lastName;
  }

  req.user.save(function(err, savedUser) {
    if (err) {
      return next(err);
    }
    res.send(savedUser);
  });
});

/* PUT update user */
router.put('/:username', loadUser, function(req, res, next) {

  // Update all properties (regardless of whether they are in the request body or not)
  req.user.username = req.body.username;
  req.user.firstName = req.body.firstName;
  req.user.lastName = req.body.lastName;

  req.user.save(function(err, savedPerson) {
    if (err) {
      return next(err);
    }

    res.send(savedPerson);
  });
});

function loadUser(req, res, next) {
  User.findOne({"username" : req.params.username}).exec(function(err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return res.status(404).send('No user found with the username : ' + req.params.username);
    }
    req.user = user;
    next();
  });
}

module.exports = router;
