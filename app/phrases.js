/* jslint node:true */

'use strict';

var pharsesHTML = require('./phrasesHTML');
var pharsesCSV = require('./phrasesCSV');
var path = require('path');
var file = require('./file');

var filePath;
var fileName;
var dir;
var html;

function output(object) {
  if (html) {
    return pharsesHTML(object);
  } else {
    return pharsesCSV(object, dir);
  }
}

function write(data) {
  file.write(data, html, dir, fileName);
}

function done() {
  console.log('Done');
}

function fail(error) {
  console.error(error.stack.split('\n'));
}

module.exports = (options) => {
  filePath = options.file;
  fileName = path.basename(filePath, '.html');
  dir = path.dirname(filePath);
  html = options.html;
  file.getRaw(filePath)
    .then(output)
    .then(write)
    .then(done)
    .catch(fail);
};
