
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var project = new Schema({
  // if its a firebase project, will have this field
  fireBaseKey: String,

  // basic details
  proj_pi: String,
  proj_creator: String,
  proj_name: String,
  proj_date: String,
  proj_des: String,
  proj_contact: String,

  // authorities
  accessType: String,
  proj_autho: [String],
  proj_autho_read_only: [String]

},{
  collection: 'projects'
});

module.exports = mongoose.model('project', project);
