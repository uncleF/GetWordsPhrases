/* jslint node:true */

'use strict';

var puppeteer = require('puppeteer');
var url = require('url');
var fse = require('fs-extra');
var mkdirp = require('mkdirp');
var path = require('path');

function dowloadFile(resource, dir) {
  return new Promise(async (resolve, reject) => {
    try {
      var urlObject = url.parse(resource);
      var fileName = path.basename(urlObject.pathname);
      var filePath = path.extname(fileName) !== '' ? `${dir}/${fileName}` : `${dir}/${fileName}.html`;
      var browser = await puppeteer.launch();
      var page = await browser.newPage();
      page.on('response', async function writeResponse(response) {
        if (response.url() === resource) {
          page.off('response', writeResponse);
          var buffer = await response.buffer();
          await fse.outputFile(filePath, buffer);
          resolve(filePath);
          browser.close();
        }
      });
      await page.goto(resource);
    } catch(error) {
      reject(error);
    }
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
