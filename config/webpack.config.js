'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      codemirror: PATHS.src + '/codemirror.js',
      syntax_highlight: PATHS.src + '/syntax_highlight.js',
      markdown_display: PATHS.src + '/markdown_display.js',
      contentScript: PATHS.src + '/contentScript.js',
      // extra: PATHS.src + '/extra.js',
      // coq: PATHS.src + '/coq.js',
      // nasm: PATHS.src + '/nasm.js',
      // perl6: PATHS.src + '/perl6.js',
      // prolog: PATHS.src + '/prolog.js',
      // purescript: PATHS.src + '/purescript.js',
      // reason: PATHS.src + '/reason.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
  });

module.exports = config;
