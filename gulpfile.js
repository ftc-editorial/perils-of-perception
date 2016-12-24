const fs = require('mz/fs');
const path = require('path');
const co = require('co');
const render = require('./utils/render.js');

const del = require('del');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');

process.env.NODE_ENV = 'dev';

// change NODE_ENV between tasks.
gulp.task('prod', function(done) {
  process.env.NODE_ENV = 'prod';
  done();
});

gulp.task('dev', function(done) {
  process.env.NODE_ENV = 'dev';
  done();
});

gulp.task('build-pages', () => {
  return co(function *() {
    const destDir = '.tmp';
    
    try {
      yield fs.access(destDir, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {    
      yield fs.mkdir(destDir);
    }
    const prod = process.env.NODE_ENV === 'prod';
    const flags = {
      prod,
      analytics: prod
    };
    const article = yield fs.readFile('./data/article.json', 'utf8');
    const context = Object.assign(JSON.parse(article), {
      flags
    });

    const html = yield render('index.html', context);

    yield fs.writeFile(`${destDir}/index.html`, html, 'utf8');     
  })
  .then(function(){
    browserSync.reload('*.html');
  }, function(err) {
    console.error(err.stack);
  });
});

gulp.task('styles', function styles() {
  const DEST = '.tmp/styles';

  return gulp.src('client/styles.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init({loadMaps:true}))
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['bower_components']
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      cssnext({
        features: {
          colorRgba: false
        }
      })
    ]))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(DEST))
    .pipe(browserSync.stream());
});

gulp.task('webpack', function(done) {
  if (process.env.NODE_ENV === 'prod') {
    delete webpackConfig.watch;
  }
  webpack(webpackConfig, function(err, stats) {
    if (err) throw new $.util.PluginError('webpack', err);
    $.util.log('[webpack]', stats.toString({
      colors: $.util.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    }))
    browserSync.reload('main.js');
    done();
  });
});

gulp.task('copy', () => {
  return gulp.src('client/components/core/top.*')
    .pipe(gulp.dest('.tmp/components/core'));
});


gulp.task('serve', 
  gulp.parallel(
    'copy', 'build-pages', 'styles', 'webpack',

    function serve() {
    browserSync.init({
      server: {
        baseDir: ['.tmp', 'data'],
        index: 'index.html',
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch('client/**/**/*.scss', gulp.parallel('styles'));
    gulp.watch(['views/**/*.html', 'data/*.json'], gulp.parallel('build-pages'));
  })
);

gulp.task('clean', function() {
  return del(['.tmp/**', 'dist']).then(()=>{
    console.log('dir .tmp and dist deleted');
  });
});