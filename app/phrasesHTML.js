/* jslint node:true */

'use strict';

var cheerio = require('cheerio');
var parse = require('./parse');
var frontend = require('./frontend');

function getPhraseParagraph(element) {
  var phrase = parse.getPhrase(element);
  return phrase ? (`<p class="phrase"><span>${phrase}</span></p>`).toLowerCase().replace(/\s{2,}|\s+$/g, '') : false;
}

function getTranslationParagraph(element, languageString) {
  var translation = parse.getPhraseTranslation(element, languageString);
  return translation ? (`<p class="translation"><span>${translation}</span></p>`).toLowerCase().replace(/\s{2,}|\s+$/g, '') : false;
}

function getElementHTML(element, languageString) {
  var audio = parse.getAudioURL(element);
  var phrase = getPhraseParagraph(element);
  var translation = getTranslationParagraph(element, languageString);
  if (audio && phrase && translation) {
    return `<div class="item">
              <p class="mp3"><span>${audio}</span></p>
              ${phrase}
              ${translation}
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
    var listP = '';
    var css = frontend.getCSS();
    var js = frontend.getJS();
    object.find('.ill-wlv__block-d, .ill-wlv__block-i').each(function() {
      listP += getElementHTML($(this), languageString);
    });
    Promise
      .all([css, js])
      .then((resources) => {
        resolve(`<html>
                  <style>${resources[0]}</style>
                 </html>
                 <body>
                   <div id="resultsN" class="result resultP">${listP}</div>
                   <script>${resources[1]}</script>
                 </body>`);
      })
      .catch(reject);
  });
};
