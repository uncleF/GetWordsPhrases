#! /usr/bin/env node --harmony-rest-parameters

/* jslint node:true */

'use strict';

var getDictionary = require('./data');
var app = require('commander');

var options = {
  words: true
};

app
  .version('1.0.0')
  .usage('-s <file> [options] | -l <file> [options]')
  .option('-s, --source [path]', 'path or URL for the source HTML-file')
  .option('-l, --list [path]', 'path to the text file containing paths or URLs for the sources')
  .option('-w, --words', 'pick out words')
  .option('-p, --phrases', 'pick out phrases')
  .option('-H, --html', 'output as a single HTML-file')
  .parse(process.argv);

options = {
  source: app.source,
  list: app.list,
  words: app.words,
  phrases: app.phrases,
  html: app.html
};

if (options.source || options.list) {
  getDictionary(options);
} else {
  app.help();
}
