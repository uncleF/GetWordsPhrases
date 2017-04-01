/* jslint node:true */

'use strict';

var fs = require('fs');

function getRaw(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, function(error, data) {
      if (error) {
        reject(error);
      } else if (file === '') {
        reject();
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

function writeCSV(data, dir) {
  var promises = [];
  for (let key in data) {
    promises.push(writeFile(data[key], dir, `${key}.csv`));
  }
  return Promise.all(promises);
}

function write(data, html, dir) {
  if (html) {
    return writeFile(data, dir, `html-output.html`);
  } else {
    return writeCSV(data, dir);
  }
}

exports.getRaw = getRaw;
exports.write = write;
