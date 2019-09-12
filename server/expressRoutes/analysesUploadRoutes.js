var express = require('express');
var router = express.Router();
var multer = require('multer');
var mkdirp = require('mkdirp');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function (req, res, next) {
  let sample_id = req.header('sp-id') || "others";
  let image_id = req.header('img-id') || "others";
  mkdirp('./uploads/'+ sample_id+ "/"+image_id, function(err) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/'+ sample_id+ "/"+ image_id)
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname)
      }
    });
    const upload = multer({storage: storage}).single('analyses');
    let path = '';
    upload(req, res, function (err) {
      if (err) {
        console.log(err);
        return res.status(422).send("an Error occured")
      }
      path = req.file.path;
      return res.send("Upload Completed for "+path);
    });
  });

});


module.exports = router;
