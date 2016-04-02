/* jslint node:true */

'use strict';

var fs = require('fs');

function getRaw(file) {
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

function writeFile(data, dir, filename) {
  return new Promise((resolve, reject) => {
    fs.appendFile(`${dir}/${filename}`, data, function(error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function writeCSV(data, dir, filename) {
  var promises = [];
  for (let key in data) {
    promises.push(writeFile(data[key], dir, `${filename}-${key}.csv`));
  }
  return promises;
}

function write(data, html, dir, filename) {
  if (html) {
    writeFile(data, dir, `${filename}-output.html`);
  } else {
    writeCSV(data, dir, filename);
  }
}

exports.getRaw = getRaw;
exports.write = write;
