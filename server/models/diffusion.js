var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var analysis = new Schema({
  // if its a firebase image, will have this field
  fireBaseKey: String,

  ref_id: String,
  ele_name: String,
  ele_unit: String,
  ref_name: String,
  pos_x_unit: String,
  pos_y_unit: String,
  pos_z_unit: String,
  color: String,
  aly_type: String,
  aly_instrument: String,
  aly_cond: String,
  aly_comment: String,

  pos_x: Number,
  pos_y: Number,
  pos_z: Number,
  pos_pix_x: Number,
  pos_pix_y: Number,

  // Set data to be any
  data: Schema.Types.Mixed

});

// Define collection and schema for Items
var diffusion = new Schema({

  dif_name: String,
  img_id: String,
  dif_instrument: String,
  dif_time: String,
  dif_comment: String,

  imgA_ratio_w: Number,
  imgA_ratio_h: Number,
  imgB_ratio_w: Number,
  imgB_ratio_h: Number,

  // analysis
  data_list: {
    type: [analysis],
    default: undefined
  },

});

module.exports = mongoose.model('diffusion', diffusion);
