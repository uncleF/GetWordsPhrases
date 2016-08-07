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
  var gender = element.find('.ill-wlv__section-b__gender').text();
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
  return element.find('.ill-wlv__block-c .ill-wlv__section-b__part-of-speech').text();
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
  var wordElement = element.find('.ill-wlv__block-c .ill-wlv__section-b__target .ill-direction-wrapper');
  if (wordElement.length <= 0) {
    wordElement = element.find('.ill-wlv__block-c .ill-wlv__section-b__target').find('*').remove().end();
  }
  return wordElement.text();
}

function getPhrase(element) {
  return element.find('.ill-wlv__section-b__target').text();
}

function getWordTranslation(element, languageString) {
  return languageString.indexOf('English') <= -1 ? element.find('.ill-wlv__block-c .ill-wlv__section-b__english').text() : false;
}

function getPhraseTranslation(element, languageString) {
  return languageString.indexOf('English') <= -1 ? element.find('.ill-wlv__section-b__english.ill-oita').text() : false;
}

function getImageSrc(element) {
  return element.find('.ill-wlv__section-a__image').attr('data-original');
}

function getDoubleImageURL(element) {
  return element.find('.ill-wlv__section-a__image').attr('data-double');
}

function getAudioURL(element) {
  return element.find('.ill-onebuttonplayer').attr('data-url');
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
