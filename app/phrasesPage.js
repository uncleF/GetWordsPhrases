/* jslint node:true */

'use strict';

var pharsesHTML = require('./phrasesHTML');
var pharsesCSV = require('./phrasesCSV');
var cheerio = require('cheerio');
var cleanup = require('./cleanup');

function checkPhrase(item) {
  return item.children().find('.wlv-item__word-class').length <= 0;
}

function checkExamples(item) {
  return item.hasClass("wlv-item__sample");
}

function getCard(item) {
  return {
    list: 'phrases',
    audio: item.children().find('.wlv-item__audio-box audio').attr('src'),
    spelling: item.children().find('.wlv-item__word').text(),
    translation: item.children().find('.wlv-item__english').text()
  };
}

module.exports = (raw, html, dir) => {
  var $ = cheerio.load(raw);
  var object = $('html');
  var items = object.find(".wlv-item__word-box, .wlv-item__sample").toArray();
  var list = [];
  var renderOutput = html ? pharsesHTML : pharsesCSV;
  var list = items.reduce(function(result, item) {
    item = $(item);
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
