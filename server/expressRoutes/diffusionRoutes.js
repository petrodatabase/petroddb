// diffusionRoutes.js

var express = require('express');
var diffusionRoutes = express.Router();

// Require Item model in our routes module
var Diffusion = require('../models/diffusion');

// require auth
var defaultApp = require('../config/Authentication.js');

// Defined store route
diffusionRoutes.route('/add').post(function (req, res) {
  var diffusion = new Diffusion(req.body);
  diffusion.save()
    .then(item => {
      res.status(200).json({item});
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
diffusionRoutes.route('/').get(function (req, res) {
  let imgID = req.header("img");
  let token = req.header('token') || "no token";


  defaultApp.auth().verifyIdToken(token)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;

      // get diffusion by imgID, if query is null, get all diffusions
      let query = {};
      if (imgID) {
        query = {...query, img_id: imgID};
      }

      Diffusion.find(query, function (err, projects) {
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
diffusionRoutes.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Diffusion.findById(id, function (err, diffusion){
    res.json(diffusion);
  });
});

//  Defined update route
diffusionRoutes.route('/update/:id').put(function (req, res) {
  Diffusion.findById(req.params.id, function(err, diffusion) {
    if (!diffusion)
      return next(new Error('Could not load Document'));
    else {
      for ( item of Object.keys(req.body)){
        diffusion[item] = req.body[item];
      }
      diffusion.save().then(diffusion => {
        res.json({...diffusion, status: 200});
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
diffusionRoutes.route('/delete/:id').get(function (req, res) {
  Diffusion.findByIdAndRemove({_id: req.params.id}, function(err, diffusion){
    if(err) res.json(err);
    else res.json('Successfully removed');
  });
});

module.exports = diffusionRoutes;
