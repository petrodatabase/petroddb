// fileRoutes.js

var express = require('express');
var fileRoutes = express.Router();
const fs = require('fs');
// Require Item model in our routes module
var File = require('../models/linkFiles');

// Defined store route
fileRoutes.route('/add').post(function (req, res) {
  var file = new File(req.body);
  file.save()
    .then(item => {
      res.status(200).json({item});
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
fileRoutes.route('/').get(function (req, res) {
  File.find(function (err, projects){
    if(err){
      console.log(err);
    }
    else {
      res.json(projects);
    }
  });
});

// Defined edit route
fileRoutes.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  File.findById(id, function (err, file){
    res.json(file);
  });
});

//  Defined update route
fileRoutes.route('/update/:id').put(function (req, res) {
  File.findById(req.params.id, function(err, file) {
    if (!file)
      return next(new Error('Could not load Document'));
    else {
      for ( item of Object.keys(req.body)){
        file[item] = req.body[item];
      }
      file.save().then(file => {
        res.json({...file, status: 200});
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
fileRoutes.route('/delete/:id').get(function (req, res) {
  let sample_id = req.header('sp_id') ;
  let image_id = req.header('img_id');
  let stored_file_name = req.header('stored_file_name');

  // remove file in uploads folder
  if(sample_id !== undefined){
    let DIRpath = './uploads/'+ sample_id;
    if(image_id) {
      DIRpath = './uploads/'+ sample_id + "/" + image_id;
    }
    fs.unlinkSync(DIRpath + "/" + stored_file_name);
  }
  else{
    console.log("there is no sp_id");
  }

  //remove record in mongodb database
  File.findByIdAndRemove({_id: req.params.id}, function(err, file){
    if(err) res.json(err);
    else {
      res.json('Successfully removed');
    }
  });
});

module.exports = fileRoutes;
