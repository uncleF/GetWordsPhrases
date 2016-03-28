/* jslint node:true */

'use strict';

var http = require('http');
var url = require('url');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

function dowloadFile(resource, dir) {
  return new Promise((resolve, reject) => {
    var urlObject = url.parse(resource);
    var options = {
      host: urlObject.host,
      path: urlObject.pathname
    };
    var fileName = path.basename(urlObject.pathname);
    var file = fs.createWriteStream(`${dir}/${fileName}`);
    http.get(options, response => {
      response.on('data', function(data) {
        file.write(data);
      }).on('end', function() {
        file.end();
        resolve();
      });
    }).on('error', reject);
  });
}

function downloadResources(data) {
  var dir = data.dir;
  mkdirp(dir);
  return Promise.all(data.list.map(resource => dowloadFile(resource, dir)));
}

function getURLs(keys, array) {
  var result = [];
  array.forEach(item => {
    if (typeof keys === 'string') {
      result.push(item[keys]);
    } else {
      keys.forEach(key => result.push(item[key]));
    }
  });
  return result;
}

function prepareDownloads(keys, dir, arrays) {
  var list = [];
  arrays.forEach(array => list = list.concat(array));
  list = getURLs(keys, list);
  return new Promise(resolve => resolve({dir: dir, list: list}));
}

module.exports = (keys, dir, ...arrays) => {
  return prepareDownloads(keys, dir, arrays)
    .then(downloadResources);
};
