
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var chart = new Schema({

  chart_name: String,
  img_id: String,
  type: String,
  x_axis: String,
  x_title: String,
  y_axis: String,
  y_title: String,
  other_axes: [String],
  data_ids: [String],
  comment: String,
  r_x_axis: Number,
  r_y_axis: Number

});

module.exports = mongoose.model('chart', chart);
