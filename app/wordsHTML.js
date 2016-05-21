/* jslint node:true */

'use strict';

var frontend = require('./frontend');

function getArticleParagraph(article) {
  return article ? `<p class="article"><span>${article}</span></p>` : '';
}

function getTranslationParagraph(translation) {
  return translation ? `<p class="translation"><span>${translation}</span></p>` : '';
}

function getCard(word) {
  return `<div class="item">
            <img src="${word.image}">
            <p class="spelling"><span>${word.spelling}</span></p>
            <p class="image"><span>${word.image}</span></p>
            <p class="mp3"><span>${word.audio}</span></p>
            ${getArticleParagraph(word.article)}
            ${getTranslationParagraph(word.translation)}
          </div>`;
}

function getLists(words) {
  var lists = {};
  words.forEach(word => {
    if (lists[word.list]) {
      lists[word.list] += getCard(word);
    } else {
      lists[word.list] = getCard(word);
    }
  });
  return lists;
}

function getHTMLLists(words) {
  var lists = getLists(words);
  var htmlLists = '';
  for (let key in lists) {
    htmlLists += `<div id="results-${key}" class="results results-${key}">${lists[key]}</div>`;
  }
  return htmlLists;
}

function getHTML(resources) {
  return `<html>
            <style>${resources[0]}</style>
          </html>
          <body>
            ${getHTMLLists(resources[2])}
            <script>${resources[1]}</script>
          </body>`;
}

module.exports = (words) => {
  return Promise
    .all([frontend.getCSS(), frontend.getJS(), words])
    .then(getHTML);
};
