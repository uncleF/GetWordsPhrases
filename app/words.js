/* jslint node:true */

'use strict';

var getHTML = require('./wordsHTML');
var getCSV = require('./wordsCSV');
var fs = require('fs');
var path = require('path');

var file;
var basename;
var dir;
var html;

function getRaw() {
  return new Promise((resolve, reject) => {
    fs.readFile(file, function(error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

function output(object) {
  if (html) {
    return getHTML(object);
  } else {
    return getCSV(object, dir);
  }
}

function writeFile(data, filename) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${dir}/${filename}`, data, function(error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function writeAllCSV(data) {
  return data.map((item, index) => writeFile(item.items, `${basename}-${item.name}.csv`));
}

function write(data) {
  if (html) {
    writeFile(data, `${basename}-output.html`);
  } else {
    writeAllCSV(data);
  }
}

function done() {
  console.log('Done');
}

function fail(error) {
  console.error(error);
}

module.exports = (options) => {
  file = options.file;
  basename = path.basename(file, '.html');
  dir = path.dirname(file);
  html = options.html;
  getRaw()
    .then(output)
    .then(write)
    .then(done)
    .catch(fail);
};
