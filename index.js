#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var glob = require('glob');
var readline = require('readline');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var pjson = require('./package.json');
var files = [];

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

console.log(`Risk Code Tool v${pjson.version}`);
console.log('argv', argv);
console.log('path', path);
console.log('log', log);

function outputScore(index, line) {
  files[index].sanitized = line.replace('.', ' ').replace('(', ' ').replace(/[^a-zA-Z ]/g, '').trim();
  files[index].analyzed = sentiment.analyze(files[index].sanitized);
  files[index].line += 1;
  if (files[index].sanitized.length > 0 && files[index].analyzed.score <= log) {
    var color = colorGreen;
    if (files[index].analyzed.score <= -3) {
      color = colorRed;
    } else if (files[index].analyzed.score <= 0) {
      color = colorYellow;
    }
    console.log(color, `${files[index].path}:${files[index].line} ${files[index].sanitized}`);
  }
}

function loadFiles(folder) {
  files = [];
  glob(folder, function (er, paths) {
    paths.forEach(function(path, index) {
      files[index] = {
        analyzed: {},
        path: path,
        line: 0,
      };
      var lineReader = readline.createInterface({
        input: fs.createReadStream(path)
      });
      lineReader.on('line', function(line) {
        outputScore(index, line);
      });
    });
    console.log(`${paths.length} files scanned`);
  });
}

loadFiles(path);
