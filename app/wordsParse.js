/* jslint node:true */

'use strict';

function getArticles(object, languageString) {
  if (languageString.indexOf('french') > -1) {
    return ['un', 'une'];
  } else if (languageString.indexOf('portuguese') > -1) {
    return ['um', 'uma'];
  } else {
    return ['', ''];
  }
}

function getArticleString(element, masc, fem) {
  var gender = element.find('.ill-wlv__section-b__gender').text();
  if (gender === 'masc') {
    return masc;
  } else if (gender === 'fem') {
    return fem;
  } else {
    return false;
  }
}

function getLanguageString(object) {
  return object.find('.logoLnk img').attr('src');
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

function getTranslation(element, languageString) {
  return languageString.indexOf('English') <= -1 ? element.find('.ill-wlv__block-c .ill-wlv__section-b__english').text() : false;
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
exports.getTranslation = getTranslation;
exports.getImageSrc = getImageSrc;
exports.getDoubleImageURL = getDoubleImageURL;
exports.getAudioURL = getAudioURL;
