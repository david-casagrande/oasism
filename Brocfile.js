// var compileSass = require('broccoli-sass');
// var filterCoffeeScript = require('broccoli-coffee');
var esTranspiler = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');

// var sassDir = 'scss';
// var coffeeDir = 'coffeescript';
//
// var styles = compileSass([sassDir], 'app.scss', 'app.css');
// var scripts = filterCoffeeScript(coffeeDir);

var js = 'js';
js = esTranspiler(js);

module.exports = mergeTrees(['public', js]);
