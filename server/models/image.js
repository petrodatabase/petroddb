
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var image = new Schema({
  // if its a firebase image, will have this field
  fireBaseKey: String,

  vd_id: String,
  ed_id: String,
  sp_id: String,
  stored_file_name: String,

  // assume false
  isPrivate: Boolean,

  // specified time created
  createdAt: String,

  img_name: String,
  img_cat: String,
  img_cat_other: String,
  img_north: String,
  img_south: String,
  img_east: String,
  img_url: String,
  img_des: String,
  img_time: String,
  img_instr: String,
  img_instr_other:String,
  img_scale: String,
  img_color: String,

  cm_stage_x: Number,
  cm_stage_y: Number,
  cm_fullsize_w: Number,
  cm_fullsize_h: Number,
  sm_micron_bar: Number,
  sm_micron_marker: Number,

  progress: Number,

  img_pix_w: Number,
  img_pix_h: Number,

},{
  collection: 'images'
});

module.exports = mongoose.model('image', image);
