console.log('Building Plugin...');
const concat = require('concat-files');

concat([
  'node_modules/file-saver/dist/FileSaver.min.js',
  'index.js',
], 'altair-build.js', function(err) {
  if (err) throw err
  console.log('...Done.');
});
