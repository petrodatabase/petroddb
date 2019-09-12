
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var user = new Schema({
  $key: String,

  us_first: String,
  us_family: String,
  displayName: String,
  email: String,

  us_note: String,
  us_biblio: String,

  us_is_pi: Boolean,
  us_is_co: Boolean,
  us_is_up: Boolean,
  us_is_ad: Boolean,
  us_con: Boolean

});

module.exports = mongoose.model('user', user);
