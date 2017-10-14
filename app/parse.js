/* jslint node:true */

'use strict';

const LANGUAGES = {
  french: {
    masculine: 'un',
    feminine: 'une'
  },
  portuguese: {
    masculine: 'um',
    feminine: 'uma'
  }
};

function getArticles(languageString) {
  for (let key in LANGUAGES) {
    if (languageString.indexOf(key) > -1) {
      return LANGUAGES[key];
    }
  }
  return false;
}

function getArticleString(element, articles) {
  var gender = element.find('.wlv-item__word-container .wlv-item__word-gender').text();
  if (gender.indexOf('masc') > -1) {
    return articles.masculine;
  }
  if (gender.indexOf('fem') > -1) {
    return articles.feminine;
  }
  return false;
}

function getLanguageString(object) {
  return object.find('title').text().toLowerCase();
}

function getPart(element) {
  return element.find('.wlv-item__word-container .wlv-item__word-class').text();
}

function isNoun(part) {
  return part === '(n)';
}

function isAdj(part) {
  return part === '(adj)';
}

function isVerb(part) {
  return part === '(v)';
}

function getWord(element) {
  return element.find('.wlv-item__word-box .wlv-item__word-line .wlv-item__word').text();
}

function getPhrase(element) {
  return element.find('.wlv-item__word-container .wlv-item__word-line .wlv-item__word').text();
}

function getWordTranslation(element, languageString) {
  return languageString.indexOf('English') <= -1 ? element.find('.wlv-item__english-container .wlv-item__english').text() : false;
}

function getPhraseTranslation(element, languageString) {
  return languageString.indexOf('English') <= -1 ? element.find('.wlv-item__english-container .wlv-item__english').text() : false;
}

function getImageSrc(element) {
  return element.find('.wlv-item__image').attr('src');
}

function getDoubleImageURL(element) {
  return element.find('.wlv-item__image').attr('srcset').replace(' 2x', '');
}

function getAudioURL(element) {
  return element.find('.wlv-item__word-container .wlv-item__audio-box audio').attr('src');
}

exports.getArticles = getArticles;
exports.getArticleString = getArticleString;
exports.getLanguageString = getLanguageString;
exports.getPart = getPart;
exports.isNoun = isNoun;
exports.isAdj = isAdj;
exports.isVerb = isVerb;
exports.getWord = getWord;
exports.getPhrase = getPhrase;
exports.getWordTranslation = getWordTranslation;
exports.getPhraseTranslation = getPhraseTranslation;
exports.getImageSrc = getImageSrc;
exports.getDoubleImageURL = getDoubleImageURL;
exports.getAudioURL = getAudioURL;
