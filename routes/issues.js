var express = require('express');
var router = express.Router();
const Issue = require('../models/issue');


/***************** GET issue listing. *****************/

/**
 * @api {get} /issues/ Request all issues
 * @apiName GetIssues
 * @apiGroup Issue
 *
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

router.get('/', function(req, res, next) {
Issue.find().sort('status').exec(function(err, issues) {
    if (err) {
      return next(err);
    }
    res.send(issues);
  });
});


/***************** GET issue by id *****************/

/**
 * @api {get} /issue/:id Request an issue by id
 * @apiName GetIssue
 * @apiGroup Issue
 *
 * @apiParam {Number} id Unique identifier of the issue
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

router.get('/:id', loadIssue, function(req, res, next) {
 res.send(req.issue);
});


/***************** POST new issue  *****************/

/**
 * @api {post} /issues/ Create an issue
 * @apiName PostIssue
 * @apiGroup Issue
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


/***************** PATCH update issue  *****************/

/**
 * @api {patch} /issues/:id Update an issue
 * @apiName PostIssue
 * @apiGroup Issue
 *
 * @apiParam {id} id Unique identifier of the issue
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
                    console.log("je suis là");

      return next(err);

    }
    res.send(savedIssue);
  });
});


/***************** DELETE delete issuee  *****************/

/**
 * @api {delete} /issues/:id Delete an issue
 * @apiName DeleteIssue
 * @apiGroup Issue
 *
 * @apiParam {Number} id Unique identifier of the issue
 *
 * @apiSuccess status 204 issue deleted
 */

router.delete('/:id', loadIssue, function(req, res, next) {

  req.issue.remove(function(err) {
    if (err) {
      return next(err);
    }
    res.sendStatus(204);
  });
});


// find user who created the issue

function loadIssue(req, res, next) {
  Issue.findOne({"_id" : req.params.id}).exec(function(err, issue) {
    if (err) {
      return next(err);
    } else if (!issue) {
      return res.status(404).send('No issue found with the ID : ' + req.params.id);
    }
    req.issue = issue;
    next();
  });
}

module.exports = router;​
