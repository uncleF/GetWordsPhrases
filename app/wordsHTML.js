/* jslint node:true */

'use strict';

var wordsParse = require('./wordsParse');
var cheerio = require('cheerio');
var fs = require('fs');

function getWordParagraph(element) {
  return (`<p class="word"><span>${wordsParse.getWord(element)}</span></p>`).replace(/\s{2,}|\s+$/g, '$1');
}

function getTranslationParagraph(element, languageString) {
  var translation = wordsParse.getTranslation(element, languageString);
  return translation ? (`<p class="translation"><span>${translation}</span></p>`).replace(/\s{2,}|\s+$/g, '$1') : '';
}

function getArticleParagraph(element, masc, fem) {
  var article = wordsParse.getArticleString(element, masc, fem);
  return article ? `<p class="gender"><span>${article}</span></p>` : '';
}

function getElementHTML(element, part, languageString, masc, fem) {
  return `<div class="item">
            <img src="${wordsParse.getImageSrc(element)}">
            <p class="image"><span>${wordsParse.getDoubleImageURL(element)}</span></p>
            <p class="mp3"><span>${wordsParse.getAudioURL(element)}</span></p>
            ${getWordParagraph(element)}
            ${getArticleParagraph(element, masc, fem)}
            ${getTranslationParagraph(element, languageString)}
          </div>`;
}

function readResource(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/res/${file}`, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

function getCSS() {
  return readResource('styles.css');
}

function getJS() {
  return readResource('scripts.js');
}

function fail(error) {
  console.error(error);
}

module.exports = (raw) => {
  var $ = cheerio.load(raw);
  var object = $('body');
  return new Promise((resolve, reject) => {
    var languageString = wordsParse.getLanguageString(object);
    var articles = wordsParse.getArticles(object, languageString);
    var MASCULINE = articles[0];
    var FEMENINE = articles[1];
    var listN = '';
    var listA = '';
    var listV = '';
    var listR = '';
    var css = getCSS();
    var js = getJS();
    object.find('.ill-wlv__section-d').each(function() {
      var element = $(this);
      var part = wordsParse.getPart(element);
      var item = getElementHTML(element, part, languageString, MASCULINE, FEMENINE);
      if (wordsParse.isNoun(part)) {
        listN += item;
      } else if (wordsParse.isAdj(part)) {
        listA += item;
      } else if (wordsParse.isVerb(part)) {
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
      .catch(fail);
  });
};
