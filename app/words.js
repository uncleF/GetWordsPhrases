/* jslint node:true */

'use strict';

var wordsHTML = require('./wordsHTML');
var wordsCSV = require('./wordsCSV');
var parse = require('./parse');
var cheerio = require('cheerio');
var cleanup = require('./cleanup');

function getList(part) {
  if (parse.isNoun(part)) {
    return 'nouns';
  }
  if (parse.isAdj(part)) {
    return 'adjectives';
  }
  if (parse.isVerb(part)) {
    return 'verbs';
  }
  return 'rest';
}

function getImage(element) {
  return parse.getDoubleImageURL(element);
}

function getAudio(element) {
  return parse.getAudioURL(element);
}

function getWord(element) {
  return parse.getWord(element).replace(/\s{2,}|\s+$/g, '');
}

function getArticle(element, articles) {
  var article = parse.getArticleString(element, articles);
  return article || false;
}

function getTranslation(element, languageString) {
  return parse.getWordTranslation(element, languageString).replace(/\s{2,}|\s+$/g, '');
}

function getCard(element, part, languageString, articles) {
  return {
    list: getList(part),
    image: getImage(element),
    audio: getAudio(element),
    spelling: getWord(element),
    article: getArticle(element, articles),
    translation: getTranslation(element, languageString)
  };
}

module.exports = (raw, html, dir) => {
  var $ = cheerio.load(raw);
  var object = $('html');
  var languageString = parse.getLanguageString(object);
  var articles = parse.getArticles(languageString);
  var list = [];
  var renderOutput = html ? wordsHTML : wordsCSV;
  object.find('.wlv-item__box').each(function() {
    var element = $(this);
    var part = parse.getPart(element);
    var item = getCard(element, part, languageString, articles);
    if (item.image && item.audio && item.spelling) {
      list.push(item);
    }
  });
  return cleanup(list).then(array => {
    return renderOutput(array, dir);
  });
};
