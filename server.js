// server.js

// main config
const express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cors = require('cors'),
mongoose = require('mongoose'),
config = require('./server/config/DB'),
fs = require('fs'),


// api config
projectRoutes = require('./server/expressRoutes/projectRoutes');
volcanoRoutes = require('./server/expressRoutes/volcanoRoutes');
sampleRoutes = require('./server/expressRoutes/sampleRoutes');
imageUploadRoutes = require('./server/expressRoutes/imageUploadRoutes');
imageRoutes = require('./server/expressRoutes/imageRoutes');
analysesRoutes = require('./server/expressRoutes/analysesRoutes');
analysesUploadRoutes = require('./server/expressRoutes/analysesUploadRoutes');
fileRoutes = require('./server/expressRoutes/fileRoutes');
fileUploadRoutes = require('./server/expressRoutes/fileUploadRoutes');
chartRoutes = require('./server/expressRoutes/chartRoutes');
workspaceRoutes = require('./server/expressRoutes/workspaceRoutes');
diffusionRoutes = require('./server/expressRoutes/diffusionRoutes');
diffusionUploadRoutes = require('./server/expressRoutes/diffusionUploadRoutes');
// mongoose config
mongoose.Promise = global.Promise;
mongoose.connect(config.DB).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

// CORS handle
const app = express();
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cors());
const port = process.env.PORT || 4000;

// Mapping Express Route with Server Route
app.use('/projects', projectRoutes);
app.use('/volcanos', volcanoRoutes);
app.use('/samples', sampleRoutes);
app.use('/uploads/images', imageUploadRoutes);
app.use('/images', imageRoutes);
app.use('/analyses', analysesRoutes);
app.use('/uploads/analyses', analysesUploadRoutes);
app.use('/files', fileRoutes);
app.use('/uploads/files', fileUploadRoutes);
app.use('/charts', chartRoutes);
app.use('/workspaces', workspaceRoutes);
app.use('/diffusion', diffusionRoutes);
app.use('/uploads/diffusion', diffusionUploadRoutes);

// Run NOTE: This one for development
const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});

// NOTE: This one for deployment
// var cert = fs.readFileSync('/usr/local/STAR_wovodat/STAR_wovodat_org.crt');
// var key = fs.readFileSync( '/usr/local/STAR_wovodat/wovodat.org' );
// var options = {
//   key: key,
//   cert: cert,
// };
// // Run
// var https = require('https');
// https.createServer(options, app).listen(port);

