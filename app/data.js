/* jslint node:true */

'use strict';

var file = require('./file');
var words = require('./words');
var phrases = require('./phrases');
var path = require('path');
var url = require('url');
var download = require('./download');

var filePath;
var fileName;
var dir;
var html;
var wordsMode;
var phrasesMode;

function resolveSource(source) {
  return new Promise((resolve, reject) => {
    if (url.parse(source).host) {
      filePath = `${path.basename(url.parse(source).pathname)}.html`;
      dir = '.';
      fileName = path.basename(filePath, '.html');
      resolve(download.file(source, dir));
    } else {
      filePath = source;
      dir = path.dirname(filePath);
      fileName = path.basename(filePath, '.html');
      resolve(filePath);
    }
  });
}

function output(raw) {
  if (phrasesMode) {
    return phrases(raw, html, dir);
  } else {
    return words(raw, html, dir);
  }
}

function write(array) {
  file.write(array, html, dir, fileName);
}

function done() {
  console.log('Done');
}

function fail(error) {
  console.error(error.stack.split('\n'));
}

module.exports = (options) => {
  var source = options.source;
  wordsMode = options.words;
  phrasesMode = options.phrases;
  html = options.html;
  resolveSource(source)
    .then(file.getRaw)
    .then(output)
    .then(write)
    .then(done)
    .catch(fail);
};
