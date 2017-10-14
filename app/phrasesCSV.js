/* jslint node:true */

'use strict';

var download = require('./download');
var path = require('path');

function getAudio(audio) {
  return `[sound:${path.basename(audio.replace('http://cdn.innovativelanguage.com/', ''))}]`;
}

function getTranslation(translation) {
  return translation ? `,"${translation}"` : '';
}

function getCard(phrase) {
  return `"${phrase.spelling}","${getAudio(phrase.audio)}"${getTranslation(phrase.translation)}\n`;
}

function getCSV(phrases) {
  var list = '';
  phrases.forEach(phrase => list += getCard(phrase));
  return list !== '' ? {'phrases': list} : {};
}

module.exports = (phrases, dir) => {
  var downloadKeys = 'audio';
  return Promise
    .all(download.media(phrases, dir, downloadKeys))
    .then(_ => return getCSV(phrases));
};
