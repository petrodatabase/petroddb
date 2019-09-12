var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items

var imagesWorkspace = new Schema({
  img_id: String,
  stored_file_name: String,
  img_url: String,
  type: String
});

var linesWorkSpace = new Schema({
  from: String,
  to: String,
  label: String,
  type: String,
  link_pos: [Number]
});

var workspace = new Schema({
  sp_id: String,
  ws_name: String,
  ws_creator: String,
  ws_autho: [String],
  ws_des: String,
  images: Schema.Types.Mixed,
  lines: Schema.Types.Mixed,
  imagesMongo: {
    type: [imagesWorkspace],
    default: undefined
  },
  linesMongo: {
    type: [linesWorkSpace],
    default: undefined
  },

},{
  collection: 'workspaces'
});

module.exports = mongoose.model('workspace', workspace);
