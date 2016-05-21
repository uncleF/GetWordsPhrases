/* jslint node:true */

'use strict';

var frontend = require('./frontend');

function getTranslationParagraph(translation) {
  return translation ? `<p class="translation"><span>${translation}</span></p>` : '';
}

function getCard(phrase) {
  return `<div class="item">
            <p class="spelling"><span>${phrase.spelling}</span></p>
            <p class="mp3"><span>${phrase.audio}</span></p>
            ${getTranslationParagraph(phrase.translation)}
          </div>`;
}

function getList(phrases) {
  var list = '';
  phrases.forEach(phrase => list += getCard(phrase));
  return list;
}

function getHTML(resources) {
  return `<html>
            <style>${resources[0]}</style>
          </html>
          <body>
            <div id="results-phrases" class="results results-phrases">${getList(resources[2])}</div>
            <script>${resources[1]}</script>
          </body>`;
}

module.exports = (phrases) => {
  return Promise
    .all([frontend.getCSS(), frontend.getJS(), phrases])
    .then(getHTML);
};
