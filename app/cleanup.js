/* jslint node:true */

'use strict';

var uniq = require('uniq');

function compare(first, second) {
  return first.spelling === second.spelling ? 0 : 1;
}

module.exports = (array) => {
  var result = uniq(array, compare);
  return new Promise(resolve => {
    resolve(result);
  });
};
