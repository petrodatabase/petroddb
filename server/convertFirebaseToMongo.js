fs = require('fs');


var m = JSON.parse(fs.readFileSync('test.json'));
var result = [];
for ( var i = 0 ; i < Object.keys(m).length ; i++){
  var newDict = {};
  newDict['_id'] = Object.keys(m)[i];
  var obj = Object.assign({}, newDict, m[Object.keys(m)[i]]);
  result.push(obj);
}
fs.writeFileSync('test.json', JSON.stringify(result));

/* Multiple Edit */
// const array =[
//   'analyses','charts','diffusions', 'images', 'link_files' , 'observatories' , 'projects' , 'publications', 'references', 'reports' ,'samples', 'uploads', 'users', 'volcanos', 'workspaces'
// ]
//
// for (var item of array) {
//   let filePath = 'eos-volcano-petrology-'+item+'-export.json';
//   var m = JSON.parse(fs.readFileSync(filePath));
//   var result = [];
//   for ( var i = 0 ; i < Object.keys(m).length ; i++){
//     var newDict = {};
//     newDict['_id'] = Object.keys(m)[i];
//     var obj = Object.assign({}, newDict, m[Object.keys(m)[i]]);
//     result.push(obj);
//   }
//   fs.writeFileSync(filePath, JSON.stringify(result));
// }
