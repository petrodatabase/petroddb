// projectRoutes.js

var express = require('express');
var projectRoutes = express.Router();

// Require Item model in our routes module
var Project = require('../models/project');

// require auth
var defaultApp = require('../config/Authentication.js');

// Defined store route
projectRoutes.route('/add').post(function (req, res) {
  var project = new Project(req.body);
  project.save()
    .then(item => {
      res.status(200).json({item});
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
projectRoutes.route('/').get(function (req, res) {
  // get token
  let token = req.header('token') || "no token";

  // Get user id
  let user_id = req.header('user_id');

  defaultApp.auth().verifyIdToken(token)
    .then(function(decodedToken) {

      // Find project that this user can see
      if (user_id) {
        if(user_id === 'admin'){
          Project.find(
            function (err, projects) {
              if (err) {
                console.log(err);
              }
              else {
                res.json(projects);
              }
            });
        }
        else {
          Project.find(
            {
              $or: [
                {proj_creator: user_id},
                {proj_contact: user_id},
                {proj_autho: {$elemMatch: {$eq: user_id}}},
                {proj_autho_read_only: {$elemMatch: {$eq: user_id}}},
              ]
            }, function (err, projects) {
              if (err) {
                console.log(err);
              }
              else {
                res.json(projects);
              }
            });
        }
      }
      // if user id is null , return no user
      else{
        res.json({error:'no such user'});
      }

    }).catch(function(error) {
    // Handle error
    res.json({error: 'no permission'});
  });



});

// Defined edit route
projectRoutes.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Project.findById(id, function (err, project){
    res.json(project);
  });
});

//  Defined update route
projectRoutes.route('/update/:id').put(function (req, res) {
  Project.findById(req.params.id, function(err, project) {
    if (!project)
      return next(new Error('Could not load Document'));
    else {
      for ( item of Object.keys(req.body)){
        project[item] = req.body[item];
      }
      project.save().then(project => {
        res.json({...project, status: 200});
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
projectRoutes.route('/delete/:id').get(function (req, res) {
  Project.findByIdAndRemove({_id: req.params.id}, function(err, project){
    if(err) res.json(err);
    else res.json('Successfully removed');
  });
});

module.exports = projectRoutes;
