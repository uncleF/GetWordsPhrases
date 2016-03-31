/* jslint node:true */

'use strict';

var pharsesHTML = require('./phrasesHTML');
var pharsesCSV = require('./phrasesCSV');
var parse = require('./parse');
var cheerio = require('cheerio');
var cleanup = require('./cleanup');

function getAudio(element) {
  return parse.getAudioURL(element);
}

function getPhrase(element) {
  return parse.getPhrase(element).replace(/\s{2,}|\s+$/g, '');
}

function getTranslation(element, languageString) {
  return parse.getPhraseTranslation(element, languageString).replace(/\s{2,}|\s+$/g, '');
}

function getCard(element, languageString) {
  return {
    list: 'phrases',
    audio: getAudio(element),
    spelling: getPhrase(element),
    translation: getTranslation(element, languageString)
  };
}

module.exports = (raw, html, dir) => {
  var $ = cheerio.load(raw);
  var object = $('body');
  var languageString = parse.getLanguageString(object);
  var list = [];
  var renderOutput = html ? pharsesHTML : pharsesCSV;
  object.find('.ill-wlv__block-d, .ill-wlv__block-i').each(function() {
    var element = $(this);
    var item = getCard(element, languageString);
    if (item.audio && item.spelling) {
      list.push(item);
    }
  });
  return cleanup(list).then(array => {
    return renderOutput(array, dir);
  });
};
