/* jslint node:true */

'use strict';

var parse = require('./parse');
var cleanup = require('./cleanup');
var download = require('./download');
var cheerio = require('cheerio');
var path = require('path');

function getPhraseItem(element) {
  return parse.getPhrase(element).replace(/\s{2,}|\s+$/g, '');
}

function getAudioItem(element) {
  return parse.getAudioURL(element);
}

function getPhraseTranslation(element, languageString) {
  return parse.getPhraseTranslation(element, languageString);
}

function getElementData(element, languageString) {
  if (languageString.indexOf('English') <= -1) {
    return {
      audio: getAudioItem(element),
      spelling: getPhraseItem(element),
      translation: getPhraseTranslation(element, languageString),
    };
  } else {
    return {
      audio: getAudioItem(element),
      spelling: getPhraseItem(element),
    };
  }
}

function generateCSV(array) {
  var result = '';
  array.forEach(item => {
    var audio = `[sound:${path.basename(item.audio.replace('http://cdn.innovativelanguage.com/', ''))}]`;
    result += `"${audio}","${item.spelling}","${item.translation}"\n`;
  });
  return result;
}

function prepareCSV(names, ...arrays) {
  var result = [];
  if (typeof names === 'string') {
    result.push({name: names, items: generateCSV(arrays[0])});
  } else {
    arrays.forEach((array, index) => result.push({name: names[index], items: generateCSV(array)}));
  }
  return result;
}

module.exports = (raw, dir) => {
  var $ = cheerio.load(raw);
  var object = $('body');
  var media = `${dir}/media/`;
  return new Promise((resolve, reject) => {
    var languageString = parse.getLanguageString(object);
    var listP = [];
    var csv;
    object.find('.ill-wlv__block-d, .ill-wlv__block-i').each(function() {
      var item = getElementData($(this), languageString);
      if (item.audio && item.spelling) {
        listP.push(item);
      }
    });
    cleanup(listP);
    csv = prepareCSV('phrases', listP);
    download('audio', media, listP)
      .then(_ => {
        resolve(csv);
      });
  });
};
