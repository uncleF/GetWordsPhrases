/* jslint node:true */

'use strict';

var http = require('follow-redirects').http;
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
    var fileName = path.basename(options.path);
    var filePath = path.extname(fileName) !== '' ? `${dir}/${fileName}` : `${dir}/${fileName}.html`;
    var file = fs.createWriteStream(filePath);
    http.get(options, response => {
      response.on('data', function(data) {
        file.write(data);
      }).on('end', function() {
        file.end();
        resolve(filePath);
      });
    }).on('error', reject);
  });
}

function getURLs(array, keys) {
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

function dowloadMedia(array, dir, keys) {
  var list = getURLs(array, keys);
  var media = `${dir}/media`;
  mkdirp(media);
  return list.map(resource => dowloadFile(resource, media));
}

exports.file = dowloadFile;
exports.media = dowloadMedia;
