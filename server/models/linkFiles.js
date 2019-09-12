
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var linkFiles = new Schema({
  stored_file_name: String,
  img_id : String,
  sp_id: String,
},{
  collection: 'link_files'
});

module.exports = mongoose.model('linkFiles', linkFiles);
