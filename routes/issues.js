var express = require('express');
var router = express.Router();
const Issue = require('../models/issue');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/* GET issue listing. */
router.get('/', function(req, res, next) {
Issue.find().sort('status').exec(function(err, issues) {
    if (err) {
      return next(err);
    }
    res.send(issues);
  });
});

/* GET issue by id */

router.get('/:id', loadIssue, function(req, res, next) {
 res.send(req.issue);
});

/* POST new issue */
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newIssue = new Issue(req.body);
  
  newIssue.status = "new";
  newIssue.createdAt = Date.now();
  // Save that document
  newIssue.save(function(err, savedIssue) {
    if (err) {
      return next(err);
    }
    // Send the saved document in the response
    res.send(savedIssue);
  });
});

/* PATCH update issue */
router.patch('/:id', loadIssue, function(req, res, next) {

  // Update properties present in the request body
  if (req.body.status !== undefined) {
    req.issue.status = req.body.status;
  }

  if (req.body.description !== undefined) {
    req.issue.description = req.body.description;
  }

  if (req.body.imageUrl !== undefined) {
    req.issue.imageUrl = req.body.imageUrl;
  }

  if (req.body.latitude !== undefined) {
    req.issue.latitude = req.body.latitude;
  }

  if (req.body.longitude !== undefined) {
    req.issue.longitude = req.body.longitude;
  }

  if (req.body.tags !== undefined) {
    req.issue.tags = req.body.tags;
  }

  if (req.body.username !== undefined) {
    req.issue.username = req.body.username;
  }

  req.issue.updatedAt = Date.now();

  req.issue.save(function(err, savedIssue) {
    if (err) {
      return next(err);
    }
    res.send(savedIssue);
  });
});

/* DELETE delete issue */
router.delete('/:id', loadIssue, function(req, res, next) {

  req.issue.remove(function(err) {
    if (err) {
      return next(err);
    }
    res.sendStatus(204);
  });
});

function loadIssue(req, res, next) {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).send('No issue found with the ID : ' + req.params.id);
  }
  Issue.findById(req.params.id).exec(function(err, issue) {
    if (err) {
      return next(err);
    } else if (!issue) {
      return res.status(404).send('No issue found with the ID : ' + req.params.id);
    }
    req.issue = issue;
    next();
  });
}

module.exports = router;