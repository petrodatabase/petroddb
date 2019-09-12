var admin = require('firebase-admin');

var serviceAccount = require('./eos-volcano-petrology-b6ada77e0942.json');

var defaultApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://eos-volcano-petrology.firebaseio.com'
});

module.exports = defaultApp ;
