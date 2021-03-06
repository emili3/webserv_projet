var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Issue = require('../models/issue');

/**
 * @api {get} /users/ Request all users
 * @apiName GetUsers
 * @apiGroup User
 *
 *
 * @apiSuccess {String} username Username of the user
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName Last name of the user
 * @apiSuccess {String} role Role of the user "citizen" or "manager"
 * @apiSuccess {Date} createdAt Date of creation of the user
 */

/* GET users listing. */
router.get('/', function(req, res, next) {
User.find().sort('username').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

/**
 * @api {get} /users/:username Request a user's information
 * @apiName GetUser
 * @apiGroup User
 *
 *
 * @apiSuccess {String} username Username of the user
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName Last name of the user
 * @apiSuccess {String} role Role of the user "citizen" or "manager"
 * @apiSuccess {Date} createdAt Date of creation of the user
 */

/* GET user by username */
router.get('/:username', loadUser, function(req, res, next) {
 res.send(req.user);
});

/**
 * @api {get} /users/:username/issues Request a user's list of posted issues
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiSuccess {String} status Status of the issue "new", "inProgress", "canceled" or "completed"
 * @apiSuccess {String} description A detailed description of the issue
 * @apiSuccess {String} imageUrl A URL to a picture of the issue
 * @apiSuccess {Number} latitude Latitude (part of the coordinates indicating where the issue is)
 * @apiSuccess {Number} longitude Longitude (part of the coordinates indicating where the issue is)
 * @apiSuccess {String[]} tags Tags describe the issue (e.g. "accident", "broken")
 * @apiSuccess {String} username The user who reported the issue
 * @apiSuccess {Date} createAt The date at which the issue was reported
 * @apiSuccess {Date} updateAt The date at which the issue was last modified
 */

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

/**
 * @api {post} /users/ Create a user
 * @apiName Create a user
 * @apiGroup User
 *
 * @apiSuccess {String} id A unique identifier for the user generated by the server
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName Last name of the user
 * @apiSuccess {String} role Role of the user "citizen" or "manager"
 * @apiSuccess {Date} createdAt Date of creation of the user
 *
 */

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
    res.status(201);
    res.send(savedUser);
  });
});


/**
 * @api {patch} /users/:username Update a user
 * @apiName ModifyUser
 * @apiGroup User
 *
 * @apiParam {String} username Unique username of the user
 *
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 * @apiSuccess {String} role Role of the user "citizen" or "manager"
 * @apiSuccess {Date} createdAt Date of creation of the user
 */
 
/* PATCH update user */
router.patch('/:username', loadUser, function(req, res, next) {

  // Update properties present in the request body
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

/**
 * @api {delete} /users/:username Delete a user
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {String} username Unique username of the user
 *
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 * @apiSuccess {String} role Role of the user "citizen" or "manager"
 * @apiSuccess {Date} createdAt Date of creation of the user
 */

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


// find user

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
