// #! /usr/bin/env node

/* jslint node:true */

'use strict';

var words = require('./words');
var phrases = require('./phrases');
var args = require('minimist')(process.argv.slice(2));

var options = {
  file: args.f,
  mode: args.m || 'words',
  html: args.html
};
var help = args.h;

if (!help && options.file) {
  let getData;
  if (options.mode === 'words') {
    getData = words;
  } else {
    getData = phrases;
  }
  getData(options);
} else {
  console.log('Usage: ');
}
