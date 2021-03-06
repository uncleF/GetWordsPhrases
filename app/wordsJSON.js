/* jslint node:true */

'use strict';

var wordsHTML = require('./wordsHTML');
var wordsCSV = require('./wordsCSV');
var parse = require('./parse');
var cheerio = require('cheerio');
var cleanup = require('./cleanup');

function checkWord(item) {
  return item.class !== 'sentence'
}

function getList(item) {
  const { class: part } = item;
  if (part === 'noun') {
    return 'nouns'
  }
  if (part === 'adjective') {
    return 'adjectives'
  }
  if (part === 'verb') {
    return 'verbs'
  }
  return 'rest'
}

function getArticle(item, articles) {
  if (item.gender === 'masculine') return articles.masculine;
  if (item.gender === 'feminine') return articles.feminine
  return false;
}

function getCard(item, languageString, articles) {
  return {
    list: getList(item),
    image: item.image,
    audio: item.audio,
    spelling: item.target,
    article: getArticle(item, articles),
    translation: item.english,
  };
}

module.exports = (raw, html, dir) => {
  var $ = cheerio.load(raw);
  var object = $('html');
  var page = object.find('#vocab_page');
  var languageString = page.data('language').toLowerCase();
  var items = page.data('wordlist').items;
  var articles = parse.getArticles(languageString);
  var renderOutput = html ? wordsHTML : wordsCSV;
  var list = items.reduce(function(result, item) {
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
