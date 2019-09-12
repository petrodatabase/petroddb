// chartRoutes.js

var express = require('express');
var chartRoutes = express.Router();

// Require Item model in our routes module
var Chart = require('../models/chart');

// require auth
var defaultApp = require('../config/Authentication.js');

// Defined store route
chartRoutes.route('/add').post(function (req, res) {
  var chart = new Chart(req.body);
  chart.save()
    .then(item => {
      res.status(200).json({item});
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
chartRoutes.route('/').get(function (req, res) {
  let imgID = req.header("img");
  let token = req.header('token') || "no token";


  defaultApp.auth().verifyIdToken(token)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;

      // get chart by imgID, if query is null, get all charts
      let query = {};
      if (imgID) {
        query = {...query, img_id: imgID};
      }

      Chart.find(query, function (err, projects) {
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
chartRoutes.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Chart.findById(id, function (err, chart){
    res.json(chart);
  });
});

//  Defined update route
chartRoutes.route('/update/:id').put(function (req, res) {
  Chart.findById(req.params.id, function(err, chart) {
    if (!chart)
      return next(new Error('Could not load Document'));
    else {
      for ( item of Object.keys(req.body)){
        chart[item] = req.body[item];
      }
      chart.save().then(chart => {
        res.json({...chart, status: 200});
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
chartRoutes.route('/delete/:id').get(function (req, res) {
  Chart.findByIdAndRemove({_id: req.params.id}, function(err, chart){
    if(err) res.json(err);
    else res.json('Successfully removed');
  });
});

module.exports = chartRoutes;
