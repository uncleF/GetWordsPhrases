/* jslint node:true */

'use strict';

var download = require('./download');
var path = require('path');

function getImage(image) {
  return `<img src='${path.basename(image.replace('http://cdn.innovativelanguage.com/', ''))}' />`;
}

function getAudio(audio) {
  return `[sound:${path.basename(audio.replace('http://cdn.innovativelanguage.com/', ''))}]`;
}

function getArticle(article) {
  return article ? `,"${article}"` : '';
}

function getTranslation(translation) {
  return translation ? `,"${translation}"` : '';
}

function getCard(word) {
  return `"${word.spelling}","${getImage(word.image)}","${getAudio(word.audio)}"${getArticle(word.article)}${getTranslation(word.translation)}\n`;
}

function getCSV(words) {
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

module.exports = (words, dir) => {
  var downloadKeys = ['image', 'audio'];
  return Promise
    .all(download.media(words, dir, downloadKeys))
    .then(_ => {
      return getCSV(words);
    });
};
