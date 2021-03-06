/* jslint node:true */

'use strict';

var pharsesHTML = require('./phrasesHTML');
var pharsesCSV = require('./phrasesCSV');
var cheerio = require('cheerio');
var cleanup = require('./cleanup');

function checkPhrase(item) {
  return !item.class || item.class === 'sentence'
}

function checkExamples(item) {
  return item.samples;
}

function getCard(item) {
  return {
    list: 'phrases',
    audio: item.audio,
    spelling: item.target,
    translation: item.english
  };
}

module.exports = (raw, html, dir) => {
  var $ = cheerio.load(raw);
  var object = $('html');
  var page = object.find('#vocab_page');
  var items = page.data('wordlist').items;
  var list = [];
  var renderOutput = html ? pharsesHTML : pharsesCSV;
  var list = items.reduce(function(result, item) {
    if (checkPhrase(item)) {
      var card = getCard(item);
      if (card.audio && card.spelling) {
        result.push(card);
      }
    } else if (checkExamples(item)) {
      result.push(...item.samples.reduce((samples, item) => {
        var card = getCard(item);
        if (card.audio && card.spelling) {
          samples.push(card);
        }
        return samples;
      }, []))
    }
    return result;
  }, []);
  return cleanup(list).then(array => {
    return renderOutput(array, dir);
  });
};
