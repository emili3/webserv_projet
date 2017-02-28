var express = require('express');
var router = express.Router();
const Issue = require('../models/issue');

/* GET issue listing. */
router.get('/', function(req, res, next) {
Issue.find().sort('status').exec(function(err, issues) {
    if (err) {
      return next(err);
    }
    res.send(issues);
  });
});

/* GET issue by ID */
router.get('/:id', loadIssue, function(req, res, next) {
 res.send(req.issue);
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


// Ajoute l'issue à la requête
function loadIssue(req, res, next) {
  Issue.findOne({"_id" : req.params.id}).exec(function(err, issue) {
    if (err) {
      return next(err);
    } else if (!issue) {
      return res.status(404).send('No issue found with the ID :' + req.params.id);
    }
    req.issue = issue;
    next();
  });
}




module.exports = router;
