// Brocfile.js
const funnel = require('broccoli-funnel');
const merge = require('broccoli-merge-trees');
const compileSass = require('broccoli-sass-source-maps');
const babel = require('broccoli-babel-transpiler');
const Rollup = require('broccoli-rollup');
const LiveReload = require('broccoli-livereload');
const env = require('broccoli-env').getEnv();

const appRoot = 'app';

// Copy HTML file from app root to destination
const html = funnel(appRoot, {
  files: ['index.html'],
  destDir: '/'
});

// Copy JS file into assets
// let js = funnel(appRoot, {
//   files : ['app.js'],
//   destDir : '/assets'
// });

// Rollup dependencies
let js = new Rollup(appRoot, {
  rollup: {
    input: 'app.js',
    output: {
      file: 'assets/app.js',
      format: 'es',
      sourcemap: true
    }
  }
});

// Transpile JS files to ES5
js = babel(js, {
  browserPolyfill: true,
  sourceMap: 'inline',
});

// Copy CSS file into assets
// const css = funnel(appRoot, {
//   srcDir: 'styles',
//   files : ['app.css'],
//   destDir : '/assets'
// });
const css = compileSass(
  [appRoot],
  'styles/app.scss',
  'assets/app.css',
  {
    sourceMap: true,
    sourceMapEmbed: true,
    sourceMapContents: true,
  }
);

// Remove the existing module.exports and replace with:
let tree = merge([html, js, css]);

// Include live reaload server
if (env === 'development') {
  tree = new LiveReload(tree, {
    target: 'index.html',
  });
}

module.exports = tree;