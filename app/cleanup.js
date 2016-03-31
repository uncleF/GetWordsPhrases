/* jslint node:true */

'use strict';

function sortArray(array) {
  return array.sort(function(item, nextItem) {
    if (item.spelling > nextItem.spelling) {
      return 1;
    }
    if (item.spelling < nextItem.spelling) {
      return -1;
    }
    return 0;
  });
}

function removeDuplicates(array) {
  for (let index = 0, length = (array.length - 1); index < length; index += 1) {
    if (array[index].spelling === array[index + 1].spelling) {
      array.splice((index + 1), 1);
      length -= 1;
    }
  }
  return array;
}

function cleanArray(array) {
  array = sortArray(array);
  array = removeDuplicates(array);
  return array;
}

module.exports = (array) => {
  var result = array;
  return new Promise(resolve => {
    resolve(cleanArray(result));
  });
};
