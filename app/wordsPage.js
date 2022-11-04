/* jslint node:true */

'use strict';

var wordsHTML = require('./wordsHTML');
var wordsCSV = require('./wordsCSV');
var parse = require('./parse');
var cheerio = require('cheerio');
var cleanup = require('./cleanup');

function checkWord(item) {
  return item.children().find('.wlv-item__word-class').length > 0;
}

function getList(item) {
  const part = item.children().find('.wlv-item__word-box .wlv-item__word-class').text();
  if (part === '(n)') {
    return 'nouns';
  }
  if (part === '(adj)') {
    return 'adjectives';
  }
  if (part === '(v)') {
    return 'verbs';
  }
  return 'rest';
}

function getArticle(item, articles) {
  if (item.gender === 'masculine') return articles.masculine;
  if (item.gender === 'feminine') return articles.feminine
  return false;
}

function getCard(item, languageString, articles) {
  return {
    list: getList(item),
    image: item.children().find('.wlv-item__image-box img').attr('srcset').replace(' 2x', ''),
    audio: item.children().find('.wlv-item__word-box .wlv-item__audio-box audio').attr('src'),
    spelling: item.children().find('.wlv-item__word-box .wlv-item__word').text(),
    article: getArticle(item, articles),
    translation: item.children().find('.wlv-item__word-box .wlv-item__english').text(),
  };
}

module.exports = (raw, html, dir) => {
  var $ = cheerio.load(raw);
  var object = $('html');
  var page = object.find('.wlv-items');
  var languageString = page.find('.wlv-item__word').attr('lang').toLowerCase();
  var items = page.children().toArray();
  var articles = parse.getArticles(languageString);
  var renderOutput = html ? wordsHTML : wordsCSV;
  var list = items.reduce(function(result, item) {
    item = $(item);
    if (checkWord(item)) {
      var card = getCard(item, languageString, articles);
      if (card.image && card.audio && card.spelling) {
        result.push(card);
      }
    }
    return result;
  }, []);
  return cleanup(list).then(array => {
    return renderOutput(array, dir);
  });
};
