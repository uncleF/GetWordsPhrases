#! /usr/bin/env node --harmony-rest-parameters

/* jslint node:true */

'use strict';

var getDictionary = require('./data');
var app = require('commander');

var options = {
  words: true
};

app
  .version('0.0.1')
  .option('-s, --source [path]', 'path or URL to the source HTML-file')
  .option('-l, --list [path]', 'path to the txt-file containing paths or URLs to the source HTML-files')
  .option('-w, --words', 'pick out words')
  .option('-p, --phrases', 'pick out phrases')
  .option('-H, --html', 'output as a single HTML-file')
  .parse(process.argv);

options = {
  source: app.source,
  list: app.list,
  words: app.words,
  phrases: app.pharases,
  html: app.html
};

if (options.source || options.list) {
  getDictionary(options);
}
