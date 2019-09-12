// analysesRoutes.js

var express = require('express');
var analysesRoutes = express.Router();

// Require Item model in our routes module
var Analyses = require('../models/analyses');

// require auth
var defaultApp = require('../config/Authentication.js');

// Defined store route
analysesRoutes.route('/add').post(function (req, res) {
  var analyses = new Analyses(req.body);
  analyses.save()
    .then(item => {
      res.status(200).json({item});
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
analysesRoutes.route('/').get(function (req, res) {
  let imgID = req.header("img");
  let token = req.header('token') || "no token";

  defaultApp.auth().verifyIdToken(token)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;

      // get analyses by imgID, if query is null, get all analyses
      let query = {};
      if (imgID) {
        query = {...query, img_id: imgID};
      }

      Analyses.find(query, function (err, projects) {
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
analysesRoutes.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Analyses.findById(id, function (err, analyses){
    res.json(analyses);
  });
});

//  Defined update route
analysesRoutes.route('/update/:id').put(function (req, res) {
  Analyses.findById(req.params.id, function(err, analyses) {
    if (!analyses)
      return next(new Error('Could not load Document'));
    else {
      for ( item of Object.keys(req.body)){
        analyses[item] = req.body[item];
      }
      analyses.save().then(analyses => {
        res.json({...analyses, status: 200});
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
analysesRoutes.route('/delete/:id').get(function (req, res) {
  Analyses.findByIdAndRemove({_id: req.params.id}, function(err, analyses){
    if(err) res.json(err);
    else res.json('Successfully removed');
  });
});

module.exports = analysesRoutes;
