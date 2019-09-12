// imageRoutes.js

var express = require('express');
var imageRoutes = express.Router();

// Require Item model in our routes module
var Image = require('../models/image');

// require auth
var defaultApp = require('../config/Authentication.js');

// Defined store route
imageRoutes.route('/add').post(function (req, res) {
  var image = new Image(req.body);
  image.save()
    .then(item => {
      res.status(200).json({item});
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
imageRoutes.route('/').get(function (req, res) {

  let spID = req.header("sp");
  let token = req.header('token') || "no token";

  defaultApp.auth().verifyIdToken(token)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;

      // get images by spID, if query is null, get all images
      let query = {};
      if (spID) {
        query = {...query, sp_id: spID};
      }

      Image.find(query, function (err, projects) {
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
imageRoutes.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Image.findById(id, function (err, image){
    res.json(image);
  });
});

//  Defined update route
imageRoutes.route('/update/:id').put(function (req, res) {
  Image.findById(req.params.id, function(err, image) {
    if (!image)
      return next(new Error('Could not load Document'));
    else {
      for ( item of Object.keys(req.body)){
        image[item] = req.body[item];
      }
      image.save().then(image => {
        res.json({...image, status: 200});
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
imageRoutes.route('/delete/:id').get(function (req, res) {
  Image.findByIdAndRemove({_id: req.params.id}, function(err, image){
    if(err) res.json(err);
    else res.json('Successfully removed');
  });
});

module.exports = imageRoutes;
