/* jslint node:true */

'use strict';

var cheerio = require('cheerio');
var parse = require('./parse');
var frontend = require('./frontend');

function getWordParagraph(element) {
  var word = parse.getWord(element);
  return word ? (`<p class="word"><span>${word}</span></p>`).replace(/\s{2,}|\s+$/g, '') : false;
}

function getTranslationParagraph(element, languageString) {
  var translation = parse.getWordTranslation(element, languageString);
  return translation ? (`<p class="translation"><span>${translation}</span></p>`).replace(/\s{2,}|\s+$/g, '') : false;
}

function getArticleParagraph(element, masc, fem) {
  var article = parse.getArticleString(element, masc, fem);
  return article ? `<p class="gender"><span>${article}</span></p>` : '';
}

function getElementHTML(element, part, languageString, masc, fem) {
  var audio = parse.getAudioURL(element);
  var word = getWordParagraph(element);
  if (audio && word) {
    return `<div class="item">
              <img src="${parse.getImageSrc(element)}">
              <p class="image"><span>${parse.getDoubleImageURL(element)}</span></p>
              <p class="mp3"><span>${audio}</span></p>
              ${word}
              ${getArticleParagraph(element, masc, fem)}
              ${getTranslationParagraph(element, languageString)}
            </div>`;
  } else {
    return '';
  }
}

module.exports = (raw) => {
  var $ = cheerio.load(raw);
  var object = $('body');
  return new Promise((resolve, reject) => {
    var languageString = parse.getLanguageString(object);
    var articles = parse.getArticles(object, languageString);
    var MASCULINE = articles[0];
    var FEMENINE = articles[1];
    var listN = '';
    var listA = '';
    var listV = '';
    var listR = '';
    var css = frontend.getCSS();
    var js = frontend.getJS();
    object.find('.ill-wlv__section-d').each(function() {
      var element = $(this);
      var part = parse.getPart(element);
      var item = getElementHTML(element, part, languageString, MASCULINE, FEMENINE);
      if (parse.isNoun(part)) {
        listN += item;
      } else if (parse.isAdj(part)) {
        listA += item;
      } else if (parse.isVerb(part)) {
        listV += item;
      } else {
        listR += item;
      }
    });
    Promise
      .all([css, js])
      .then((resources) => {
        resolve(`<html>
                  <style>${resources[0]}</style>
                 </html>
                 <body>
                   <div id="resultsN" class="result resultN">${listN}</div>
                   <div id="resultsA" class="result resultA">${listA}</div>
                   <div id="resultsV" class="result resultV">${listV}</div>
                   <div id="resultsR" class="result resultR">${listR}</div>
                   <script>${resources[1]}</script>
                 </body>`);
      })
      .catch(reject);
  });
};
