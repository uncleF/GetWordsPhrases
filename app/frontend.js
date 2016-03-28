/* jslint node:true */

var fs = require('fs');

function readResource(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/res/${file}`, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

function getCSS() {
  return readResource('styles.css');
}

function getJS() {
  return readResource('scripts.js');
}

exports.getCSS = getCSS;
exports.getJS = getJS;
