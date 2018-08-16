var fs = require('fs');
var glob = require('glob');
var readline = require('readline');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var counter = 0;

var logLevel = 0;
var path = 'examples/**/*.*';
var colorGreen = '\x1b[32m%s\x1b[0m';
var colorYellow = '\x1b[33m%s\x1b[0m';
var colorRed = '\x1b[31m%s\x1b[0m';

function outputScore(file, line) {
  var sanitized = line.replace('.', ' ').replace('(', ' ').replace(/[^a-zA-Z ]/g, '').trim();
  var analyzed = sentiment.analyze(sanitized);
  counter += 1;
  if (sanitized.length > 0 && analyzed.score <= logLevel) {
    var color = colorGreen;
    if (analyzed.score <= -3) {
      color = colorRed;
    } else if (analyzed.score <= 0) {
      color = colorYellow;
    }
    console.log(color, file + ':' + counter + ' ' + sanitized);
  }
}

function loadFiles(folder) {
  glob(folder, function (er, files) {
    files.forEach(function(file) {
      counter = 0;
      var lineReader = readline.createInterface({
        input: fs.createReadStream(file)
      });
      lineReader.on('line', function(line) {
        outputScore(file, line);
      });
    });
    console.log(files.length + ' files scanned');
  });
}

loadFiles(path);
