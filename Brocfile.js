// var compileSass = require('broccoli-sass');
// var filterCoffeeScript = require('broccoli-coffee');
var browserify = require('broccoli-fast-browserify');
var esTranspiler = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var uglifyJavaScript = require('broccoli-uglify-js');
// var sassDir = 'scss';
// var coffeeDir = 'coffeescript';
//
// var styles = compileSass([sassDir], 'app.scss', 'app.css');
// var scripts = filterCoffeeScript(coffeeDir);

var js = 'js';
js = esTranspiler(js);
js = browserify(js, {
  bundleExtension: '.js',
  browserify: {
    debug: process.env.BROCCOLI_ENV === 'production' ? false : true
  }
});

if(process.env.BROCCOLI_ENV  === 'production') {
  js = uglifyJavaScript(js, { compress: true, mangle: true });
};

module.exports = mergeTrees(['public', 'assets', js, 'node_modules/icono/dist']);
