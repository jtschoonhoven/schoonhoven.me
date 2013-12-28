
var fs = require('fs');

fs.readFile('../data/tableObj.json', function (err, data) {
  if (err) console.log('File not found: ' + err);
  console.log('!!!!!!');
});

 exports.params = res.render('chart_maker', { 
   tableObj: JSON.stringify(  )});
