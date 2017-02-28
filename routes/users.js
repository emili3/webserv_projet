var express = require('express');
var router = express.Router();
const User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
User.find().sort('name').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

/* GET user by ID */

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

function loadUser(req, res, next) {
  User.findOne({"username" : req.params.username}).exec(function(err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return res.status(404).send('No user found with the ID :' + req.params.id);
    }
    req.user = user;
    next();
  });
}

module.exports = router;
