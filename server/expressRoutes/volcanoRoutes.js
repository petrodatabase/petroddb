// volcanoRoutes.js

var express = require('express');
var volcanoRoutes = express.Router();

// Require Item model in our routes module
var Volcano = require('../models/volcano');

// Defined store route
volcanoRoutes.route('/add').post(function (req, res) {
  var volcano = new Volcano(req.body);
  volcano.save()
    .then(item => {
      res.status(200).json({item});
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
volcanoRoutes.route('/').get(function (req, res) {
  Volcano.find(function (err, projects){
    if(err){
      console.log(err);
    }
    else {
      res.json(projects);
    }
  });
});

// Defined edit route
volcanoRoutes.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Volcano.findById(id, function (err, volcano){
    res.json(volcano);
  });
});

//  Defined update route
volcanoRoutes.route('/update/:id').put(function (req, res) {
  Volcano.findById(req.params.id, function(err, volcano) {
    if (!volcano)
      return next(new Error('Could not load Document'));
    else {
      for ( item of Object.keys(req.body)){
        volcano[item] = req.body[item];
      }
      volcano.save().then(volcano => {
        res.json({...volcano, status: 200});
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
volcanoRoutes.route('/delete/:id').get(function (req, res) {
  Volcano.findByIdAndRemove({_id: req.params.id}, function(err, volcano){
    if(err) res.json(err);
    else res.json('Successfully removed');
  });
});

module.exports = volcanoRoutes;
