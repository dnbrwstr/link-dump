var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  concat = require('gulp-concat'),
  react = require('gulp-react'),
  gulpIf = require('gulp-if'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  browserify = require('browserify'),
  watchify = require('watchify'),
  reactify = require('reactify'),
  uglify = require('gulp-uglify'),
  prefix = require('gulp-prefix'),
  minimist = require('minimist'),
  chalk = require('chalk'),
  plumber = require('gulp-plumber'),
  monitor = require('watch').createMonitor,
  express =require('express');

var paths = {
  style: './src/stylesheets',
  assets: './src/assets',
  scripts: './src/scripts',
  scriptEntryPoint: './src/scripts/init.js',
  build: './public'
};

var externalScripts = [
  { require: './node_modules/react/addons', expose: 'react' },
  { require: 'moment', expose: 'moment' },
  { require: 'wolfy87-eventemitter', expose: 'wolfy87-eventemitter'}
];

var args = minimist(process.argv.slice(2));

var isProduction = !!args.production;

function logError (error) {
  console.log(chalk.red(error));
}

function watchDir (path, callback) {
  monitor(path, {interval: 500}, function (watcher) {
    watcher.on('created', callback);
    watcher.on('changed', callback);
    watcher.on('removed', callback);
  });
}

function server () {
  express()
    .use(express.static(paths.build))
    .listen(3333);
}

function style () {
  gulp.src(paths.style + '/**.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefix({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'Firefox >= 16']
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest(paths.build))
    .on('error', logError);
}

function watchBundle (bundler, sourceFile) {
  watchify(bundler).on('update', function () {
    rebundle(bundler, sourceFile);
  });
}

function rebundle (bundler, sourceFile) {
  bundler
    .bundle()
    .on('error', logError)
    .pipe(source(sourceFile))
    .pipe(gulp.dest(paths.build));
}

function browserifyScripts (watch) {
  var opts = {
    entries: [paths.scriptEntryPoint],
    paths: [paths.scripts],
    fullPaths: true,
    cache: {}, 
    packageCache: {},
  };

  var bundler = browserify(opts);
  bundler.add(paths.scriptEntryPoint);
  bundler.transform(reactify);

  externalScripts.forEach(function (script) {
    bundler.external(script.expose);
  });

  if (watch) {
    watchBundle(bundler, 'app.js');
  }

  rebundle(bundler, 'app.js');
}

function vendorScripts(watch) {
  var opts = {
    cache: {},
    packageCache: {}
  };

  var bundler = browserify(opts);

  externalScripts.forEach(function (script) {
    console.log(script)
    bundler.require(script.require, {expose: script.expose});
  });

  console.log(bundler)

  if (watch) {
    watchBundle(bundler, 'vendor.js');
  }

  rebundle(bundler, 'vendor.js');
}

function assets () {
  gulp.src(paths.assets + '/**')
    .pipe(gulp.dest(paths.build));
}

function build () {
  vendorScripts(false);
  browserifyScripts(false);
  style();
  assets();
}

function watch () {
  vendorScripts(true);
  browserifyScripts(true);
  watchDir(paths.style, style);
  watchDir(paths.assets, assets);
}

gulp.task('build', build);
gulp.task('watch', ['build'], watch);
gulp.task('server', ['watch'], server);
