'use strict';

// *****************
// ENV VARIABLES
// *****************
var isProc = (process.env.NODE_ENV === 'production');
var hasErrors = false;
var onWatch = false;

// *****************
// MODULES / UTILS
// *****************
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');
var babelify = require('babelify');
var notifier = require('node-notifier');
var stringify = require('stringify');
var sassify = require('sassify');

// *****************
// HANDLERS
// *****************
var onError = function () {
  var args = Array.prototype.slice.call(arguments);
  hasErrors = true;
  plugins.notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %> 😡'
  }).apply(this, args);

  return this.emit('end');
};

var onSuccess = function () {
  onWatch = true;
  return plugins.notify({
    title: 'Build Success',
    message: 'Build Success 👍',
    templateOptions: {
      date: new Date()
    }
  });
};

var bundle_logger = function () {
  startTime = null;
};

// *****************
// CONFIG
// *****************
var config = (function () {
  var src  = './src';
  var dest = './build';

  var bowerDir = './bower_components';
  var nodeDir  = './node_modules';

  var _config = {
    src: src,
    dest: dest,

    script: {
      src: [
        src
      ],
      entry: src + '/index.js',
      dest: dest + '/js',
      watchPath: [
        src + '/**/*.js'
      ]
    },

    style: {
      src: src + '/**/*.scss',
      dest: dest + '/css',
      outputFile: 'autocomplete.css',
      watchPath: [
        src + '/**/*.scss',
      ],
      concatPath: [
      ],
      loadPath: [
      ]
    },

    template: {
      src: src + '/templates/**/*.html',
      dest: dest + '/templates',
      watchPath: [
        src + '/**/*.html'
      ]
    }
  };

  return _config;
})();

// *****************
// TASKS
// *****************
gulp.task('task-done-notify', function () {
  if (! hasErrors) {
    notifier.notify({title: 'Build Sucess', message: 'Done 👍' });
  }
});

// script
gulp.task('browserify', function () {
  var bundler = browserify({
    cache: {},
    packageCache: {},
    fullPaths: false,
    entries: [config.script.entry],
    extensions: ['.js', '.html'],
    debug: true,
  });

    // transform ES6 to ES5
  bundler.transform(
    babelify.configure({
      presets: ['es2015', 'stage-0'],
      plugins: ['transform-decorators-legacy'],
      only: config.src
    })
  );

  bundler.transform(
    stringify(['.html'])
  );

  bundler.transform(sassify, {
    'auto-inject': true,
    base64Encode: false,
    sourceMap: false
  });

  return bundler
    .bundle()
    .on('error', onError)
    .pipe(source('autocomplete.js'))
    .pipe(buffer())
    .pipe(plugins.sourcemaps.init({loadMaps: true}))
    .pipe(plugins.if(isProc, plugins.uglifyjs()))
    .pipe(gulp.dest(config.script.dest));
    // .pipe(browserSync.reload({stream: true}))
});

// style
gulp.task('style', function () {
  return gulp
    .src(config.style.src)
    .on('error', onError)
    .pipe(plugins.sass().on('error', onError))
    .pipe(plugins.addsrc.prepend(config.style.concatPath))
    .pipe(plugins.concatcss(config.style.outputFile))
    .pipe(plugins.if(isProc, plugins.uglifycss()))
    .pipe(gulp.dest(config.style.dest));
    // .pipe(browserSync.reload({stream: true}))
});

gulp.task('template', function () {
  return gulp
    .src(config.template.src)
    .on('error', onError)
    .pipe(gulp.dest(config.template.dest));
});

// clean dest
gulp.task('clean', function () {
  return gulp
    .src([config.dest], {read: false})
    .pipe(plugins.clean())
});

gulp.task('browser-sync', function () {
  browserSync({
    // proxy: 'localhost:5000',
    server: {
      baseDir: './'
    },
    browser: ['google chrome'],
    notify: true
  });
});

gulp.task('watch', function () {
  var queue = plugins.watchSequence(300);

  function reloadBrowser() {
    setTimeout(function() {
      browserSync.reload();
      notifier.notify({title: 'Build Sucess', message: 'Browser Reloaded 😀'});
    }, 500);
  }

  gulp.watch([].concat(config.script.watchPath, config.style.watchPath), {
    name: 'JS&CSS',
    emitOnGlob: false
  }, queue.getHandler('browserify', 'template', reloadBrowser));
  return gulp;
});

gulp.task('build', function (cb) {
  plugins.sequence('clean', ['browserify'], cb);
});

gulp.task('default', function (cb) {
  plugins.sequence('clean', ['browserify'], 'watch', 'browser-sync', 'task-done-notify', cb);
});
