/* jslint node:true */

'use strict';

var wordsParse = require('./wordsParse');
var cheerio = require('cheerio');
var mkdirp = require('mkdirp');
var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');

var media;

function getWordItem(element) {
  return wordsParse.getWord(element).replace(/\s{2,}|\s+$/g, '');
}

function getArticleItem(element, masc, fem) {
  var article = wordsParse.getArticleString(element, masc, fem);
  return article || '';
}

function getImageItem(element) {
  return wordsParse.getDoubleImageURL(element);
}

function getAudioItem(element) {
  return wordsParse.getAudioURL(element);
}

function getElementData(element, part, masc, fem) {
  if (wordsParse.isNoun(part)) {
    return {
      image: getImageItem(element),
      audio: getAudioItem(element),
      spelling: getWordItem(element),
      article: getArticleItem(element, masc, fem)
    };
  } else {
    return {
      image: getImageItem(element),
      audio: getAudioItem(element),
      spelling: getWordItem(element)
    };
  }
}

function sortItems(array) {
  return array.sort(function(item, nextItem) {
    if (item.spelling > nextItem.spelling) {
      return 1;
    }
    if (item.spelling < nextItem.spelling) {
      return -1;
    }
    return 0;
  });
}

function removeDuplicateItems(array) {
  for (let index = 0, length = array.length; index < (length - 1); index += 1) {
    if (array[index].spelling === array[index + 1].spelling) {
      array.splice((index + 1), 1);
      length -= 1;
    }
  }
  return array;
}

function cleanItems(array) {
  array = sortItems(array);
  array = removeDuplicateItems(array);
}

function getURLs(array) {
  var result = [];
  array.forEach(item => {
    result.push(item.image);
    result.push(item.audio);
  });
  return result;
}

function dowloadFile(resource) {
  mkdirp(`${media}`);
  return new Promise((resolve, reject) => {
    var urlObject = url.parse(resource);
    var options = {
      host: urlObject.host,
      path: urlObject.pathname
    };
    var fileName = path.basename(urlObject.pathname);
    var file = fs.createWriteStream(`${media}/${fileName}`);
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

function downloadResources(resources) {
  return Promise.all(resources.map(resource => dowloadFile(resource)));
}

function prepareDownloads(listN, listA, listV, listR) {
  return new Promise(resolve => resolve(getURLs([].concat(listN, listA, listV, listR))));
}

function generateCSV(array) {
  var csv = '';
  array.forEach(item => {
    var image = `<img src='${path.basename(item.image.replace('http://cdn.innovativelanguage.com/', ''))}' />`;
    var audio = `[sound:${path.basename(item.audio.replace('http://cdn.innovativelanguage.com/', ''))}]`;
    var article = item.article ? `,"${item.article}"` : '';
    csv += `"${image}","${audio}","${item.spelling}"${article}\n`;
  });
  return csv;
}

module.exports = (raw, dir) => {
  var $ = cheerio.load(raw);
  var object = $('body');
  media = `${dir}/media/`;
  return new Promise((resolve, reject) => {
    var languageString = wordsParse.getLanguageString(object);
    var articles = wordsParse.getArticles(object, languageString);
    var MASCULINE = articles[0];
    var FEMENINE = articles[1];
    var listN = [];
    var listA = [];
    var listV = [];
    var listR = [];
    object.find('.ill-wlv__section-d').each(function() {
      var element = $(this);
      var part = wordsParse.getPart(element);
      var item = getElementData(element, part, MASCULINE, FEMENINE);
      if (wordsParse.isNoun(part)) {
        listN.push(item);
      } else if (wordsParse.isAdj(part)) {
        listA.push(item);
      } else if (wordsParse.isVerb(part)) {
        listV.push(item);
      } else {
        listR.push(item);
      }
    });
    [listN, listA, listV, listR].forEach(cleanItems);
    prepareDownloads(listN, listA, listV, listR)
      .then(downloadResources)
      .then(_ => {
        var csvResult = [{
          name: 'nouns',
          items: generateCSV(listN)
        }, {
          name: 'adjectives',
          items: generateCSV(listA)
        }, {
          name: 'verbs',
          items: generateCSV(listV)
        }, {
          name: 'rest',
          items: generateCSV(listR)
        }];
        resolve(csvResult);
      });
  });
};
