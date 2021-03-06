/* jslint node:true */

'use strict';

var path = require('path');
var url = require('url');
var LineByLineReader = require('line-by-line');
var mkdirp = require('mkdirp');
let chalk = require('chalk');
var file = require('./file');
var words = require('./wordsJSON');
var phrases = require('./phrasesJSON');
var download = require('./downloadPuppeteer');

var filePath;
var sources = [];
var dir;
var html;
var allMode;
var wordsMode;
var phrasesMode;

function resolveSource(source) {
  return new Promise((resolve, reject) => {
    if (url.parse(source).host) {
      filePath = `${path.basename(url.parse(source).pathname)}.html`;
      dir = '.';
      var sources = `${dir}/sources`;
      mkdirp(sources);
      resolve(download.file(source, sources));
    } else {
      filePath = source;
      dir = path.dirname(filePath);
      resolve(filePath);
    }
  });
}

function output(raw) {
  if (allMode) {
    return Promise.all([
      words(raw, html, dir),
      phrases(raw, html, dir)
    ]).then((results) => {
      return Object.assign({}, results[0], results[1]);
    });
  } else if (phrasesMode) {
    return phrases(raw, html, dir);
  } else {
    return words(raw, html, dir);
  }
}

function write(array) {
  return file.write(array, html, dir);
}

function done(source) {
  console.log(`${chalk.green('✓')} - ${source}`);
}

function fail(error) {
  console.error(chalk.red(`✗ ${error}`));
  if (error.stack) {
    console.error(error.stack.split('\n'));
  }
}

function singleSource(source) {
  resolveSource(source)
    .then(file.getRaw)
    .then(output)
    .then(write)
    .then(_ => done(source))
    .catch(fail);
}

function iterateSources() {
  sources.forEach(source => singleSource(source));
}

function multipleSources(list) {
  let lineReader = new LineByLineReader(list);
  lineReader.on('line', source => sources.push(source));
  lineReader.on('end', iterateSources);
}

module.exports = (options) => {
  var source = options.source;
  var list = options.list;
  allMode =  options.all;
  wordsMode = options.words;
  phrasesMode = options.phrases;
  html = options.html;
  if (list) {
    multipleSources(list);
  } else {
    singleSource(source);
  }
};
