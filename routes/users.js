var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Issue = require('../models/issue');

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

/* GET user by username with list of posted issues*/
router.get('/:username/issues', loadUser, function(req, res, next) {
  Issue.find({username: req.user.username}).exec(function(err,issues){
    if (err) {
      return next(err);
    }
    else{
      res.send(issues);
    }
  });
});

/* POST new user */
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newUser = new User(req.body);

  newUser.createdAt = Date.now();
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
  if (req.body.role !== undefined) {
    req.user.role = req.body.role;
  }

  req.user.save(function(err, savedUser) {
    if (err) {
      return next(err);
    }
    res.send(savedUser);
  });
});

/* DELETE delete user */
router.delete('/:username', loadUser, function(req, res, next) {
  // Check if an issues exists before deleting
  Issue.findOne({ username: req.user.username }).exec(function(err, issue) {
    if (err) {
      return next(err);
    } else if (issue) {
      // Do not delete if any issues is posted by this user
      return res.status(409).type('text').send(`Cannot delete user ${req.user.username} because issues are posted by him`)
    }

    req.user.remove(function(err) {
      if (err) {
        return next(err);
      }
      res.sendStatus(204);
    });
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
