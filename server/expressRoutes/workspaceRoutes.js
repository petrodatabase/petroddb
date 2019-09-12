// workspaceRoutes.js

var express = require('express');
var workspaceRoutes = express.Router();

// Require Item model in our routes module
var Workspace = require('../models/workspace');

// require auth
var defaultApp = require('../config/Authentication.js');

// Defined store route
workspaceRoutes.route('/add').post(function (req, res) {
  var workspace = new Workspace(req.body);
  workspace.save()
    .then(item => {
      res.status(200).json({item});
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
workspaceRoutes.route('/').get(function (req, res) {
  let spID = req.header('sp');
  let token = req.header('token') || "no token";

  defaultApp.auth().verifyIdToken(token)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;

      // get workspace by sample, if query is null, get all workspaces
      let query = {};
      if (spID) {
        query = {...query, sp_id: spID};
      }

      Workspace.find(query, function (err, projects) {
        if (err) {
          console.log(err);
        }
        else {
          res.json(projects);
        }
      });
    }).catch(function(error) {
    // Handle error
    res.json({error: 'no permission'});
  });
});

// Defined edit route
workspaceRoutes.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Workspace.findById(id, function (err, workspace){
    res.json(workspace);
  });
});

//  Defined update route
workspaceRoutes.route('/update/:id').put(function (req, res) {
  Workspace.findById(req.params.id, function(err, workspace) {
    if (!workspace)
      return next(new Error('Could not load Document'));
    else {
      for ( item of Object.keys(req.body)){
        workspace[item] = req.body[item];
      }
      workspace.save().then(workspace => {
        res.json({...workspace, status: 200});
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
workspaceRoutes.route('/delete/:id').get(function (req, res) {
  Workspace.findByIdAndRemove({_id: req.params.id}, function(err, workspace){
    if(err) res.json(err);
    else res.json('Successfully removed');
  });
});

module.exports = workspaceRoutes;
