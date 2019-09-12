// sampleRoutes.js

var express = require('express');
var sampleRoutes = express.Router();

// Require Item model in our routes module
var Sample = require('../models/sample');

// require auth
var defaultApp = require('../config/Authentication.js');

// Defined store route
sampleRoutes.route('/add').post(function (req, res) {
  var sample = new Sample(req.body);
  sample.save()
    .then(item => {
      res.status(200).json({item});
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
sampleRoutes.route('/').get(function (req, res) {
  let vd = req.header('vd');
  let proj = req.header('proj');
  let token = req.header('token') || "no token";

  defaultApp.auth().verifyIdToken(token)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;
      // console.log("verified", uid , decodedToken.exp);

      // get sample by volcano or project, if query is null, get all samples
      let query = {};
      if (vd) {
        query = {...query, vd: vd};
      }
      if (proj) {
        query = {...query, proj: proj};
      }

      Sample.find(query, function (err, projects) {
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
sampleRoutes.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Sample.findById(id, function (err, sample){
    res.json(sample);
  });
});

//  Defined update route
sampleRoutes.route('/update/:id').put(function (req, res) {
  Sample.findById(req.params.id, function(err, sample) {
    if (!sample)
      return next(new Error('Could not load Document'));
    else {
      for ( item of Object.keys(req.body)){
        sample[item] = req.body[item];
      }
      sample.save().then(sample => {
        res.json({...sample, status: 200});
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
sampleRoutes.route('/delete/:id').get(function (req, res) {
  Sample.findByIdAndRemove({_id: req.params.id}, function(err, sample){
    if(err) res.json(err);
    else res.json('Successfully removed');
  });
});

module.exports = sampleRoutes;
