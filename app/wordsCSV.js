/* jslint node:true */

'use strict';

var parse = require('./parse');
var cleanup = require('./cleanup');
var download = require('./download');
var cheerio = require('cheerio');
var path = require('path');

function getWordItem(element) {
  return parse.getWord(element).replace(/\s{2,}|\s+$/g, '');
}

function getArticleItem(element, masc, fem) {
  var article = parse.getArticleString(element, masc, fem);
  return article || '';
}

function getImageItem(element) {
  return parse.getDoubleImageURL(element);
}

function getAudioItem(element) {
  return parse.getAudioURL(element);
}

function getElementData(element, part, masc, fem) {
  if (parse.isNoun(part)) {
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

function generateCSV(array) {
  var result = '';
  array.forEach(item => {
    var image = `<img src='${path.basename(item.image.replace('http://cdn.innovativelanguage.com/', ''))}' />`;
    var audio = `[sound:${path.basename(item.audio.replace('http://cdn.innovativelanguage.com/', ''))}]`;
    var article = item.article ? `,"${item.article}"` : '';
    result += `"${image}","${audio}","${item.spelling}"${article}\n`;
  });
  return result;
}

function prepareCSV(names, ...arrays) {
  var result = [];
  arrays.forEach((array, index) => result.push({name: names[index], items: generateCSV(array)}));
  return result;
}

module.exports = (raw, dir) => {
  var $ = cheerio.load(raw);
  var object = $('body');
  var media = `${dir}/media/`;
  return new Promise((resolve, reject) => {
    var languageString = parse.getLanguageString(object);
    var articles = parse.getArticles(object, languageString);
    var MASCULINE = articles[0];
    var FEMENINE = articles[1];
    var listN = [];
    var listA = [];
    var listV = [];
    var listR = [];
    var csv;
    object.find('.ill-wlv__section-d').each(function() {
      var element = $(this);
      var part = parse.getPart(element);
      var item = getElementData(element, part, MASCULINE, FEMENINE);
      if (parse.isNoun(part)) {
        listN.push(item);
      } else if (parse.isAdj(part)) {
        listA.push(item);
      } else if (parse.isVerb(part)) {
        listV.push(item);
      } else {
        listR.push(item);
      }
    });
    cleanup(listN, listA, listV, listR);
    csv = prepareCSV(['nouns', 'adjectives', 'verbs', 'rest'], listN, listA, listV, listR);
    download(['image', 'audio'], media, listN, listA, listV, listR)
      .then(_ => resolve(csv));
  });
};
