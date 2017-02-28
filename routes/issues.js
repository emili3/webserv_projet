var express = require('express');
var router = express.Router();
const Issue = require('../models/issue');

/* GET issue listing. */
router.get('/', function(req, res, next) {
Issue.find().sort('description').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(issues);
  });
});

/* POST new issue */
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newIssue = new Issue(req.body);
  // Save that document
  newIssue.save(function(err, savedIssue) {
    if (err) {
      return next(err);
    }
    // Send the saved document in the response
    res.send(savedIssue);
  });
});

module.exports = router;
