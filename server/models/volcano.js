
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var volcano = new Schema({
  // if its a firebase volcano, will have this field
  fireBaseKey: String,
  vd_cavw: String,
  cc_id: [String],

  vd_num: String,
  vd_name: String,
  vd_name2: String,
  vd_tzone: String,
  vd_mcont: String,
  vd_com: String,
  vd_loaddate: String,
  vd_pubdate: String,
  cc_id_load: String,

  vd_inf_status: [String],
  vd_inf_status_other: String,
  vd_inf_rtype: [String],
  vd_inf_rtype_other: String,
  vd_inf_type: [String],
  vd_inf_type_other: String,

  vd_inf_desc: String,
  vd_inf_proj: String,
  vd_inf_datum: String,
  vd_inf_country: String,
  vd_inf_subreg: String,
  vd_inf_loc: String,
  vd_inf_evol: String,
  vd_inf_numcald: String,
  vd_inf_stime: String,
  vd_inf_stime_unc: String,
  vd_inf_etime: String,
  vd_inf_etime_unc: String,

  vd_inf_lcald_dia: Number,
  vd_inf_ycald_lat: Number,
  vd_inf_ycald_lon: Number,

  vd_inf_slat: Number,
  vd_inf_slon: Number,

  vd_has_sps: Boolean,

  vd_inf_selev: Number,
  // fields only for searching features
  vd_projs: [String],
  vd_samples: [String],
  vd_selected_proj: Number,

},{
  collection: 'volcanos'
});

module.exports = mongoose.model('volcano', volcano);
