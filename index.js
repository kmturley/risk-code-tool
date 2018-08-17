#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var glob = require('glob');
var readline = require('readline');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var pjson = require('./package.json');

var log = 0;
var path = '**/*.*';
var colorGreen = '\x1b[32m%s\x1b[0m';
var colorYellow = '\x1b[33m%s\x1b[0m';
var colorRed = '\x1b[31m%s\x1b[0m';

if (argv.path) {
  path = argv.path;
}

if (argv.log) {
  log = argv.log;
}

console.log(`------`);
console.log(`Risk Code Tool v${pjson.version}`);
console.log(`------`);

function searchFiles(pattern) {
  var promises = [];
  var totalLines = 0;
  var totalLinesFailed = 0;
  glob(pattern, function (error, paths) {
    paths.forEach(function(path, index) {
      promises.push(new Promise((resolve) => {
        var file = {
          path: path,
          total: 0,
          lines: []
        };
        var lineReader = readline.createInterface({
          input: fs.createReadStream(path)
        });
        lineReader.on('line', function(line) {
          file.total += 1;
          totalLines += 1;
          var line = {
            sanitized: line.replace('.', ' ').replace('(', ' ').replace(/[^a-zA-Z ]/g, '').trim(),
            analyzed: null,
            num: file.total
          };
          line.analyzed = sentiment.analyze(line.sanitized);
          if (line.sanitized.length > 0 && line.analyzed.score <= log) {
            totalLinesFailed += 1;
            file.lines.push(line);
          }
        });
        lineReader.on('close', function() {
          resolve(file);
        });
      }));
    });
    Promise.all(promises).then(function(results) {
      results.forEach(function(file) {
        file.lines.forEach(function(line) {
          var color = colorGreen;
          if (line.analyzed.score <= -3) {
            color = colorRed;
          } else if (line.analyzed.score <= 0) {
            color = colorYellow;
          }
          console.log(color, `${file.path}:${line.num} ${line.sanitized}`);
        });
      });
      console.log(`------`);
      console.log(`Pattern used: ${pattern}`);
      console.log(`Log level: ${log}`);
      console.log(`Files scanned: ${paths.length}`);
      console.log(`Lines scanned: ${totalLines}`);
      console.log(`Lines failed: ${totalLinesFailed}`);
      console.log(`------`);
      if (totalLinesFailed > 0) {
        process.exit(1); // fails the tests
      } else {
        process.exit(0); // passes the tests
      }
    });
  });
};

searchFiles(path);
