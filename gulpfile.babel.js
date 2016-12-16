/* eslint-disable no-console, global-require */

import browserify from 'browserify';
import browserSync from 'browser-sync';
import gulp from 'gulp';
import mergeStream from 'merge-stream';
import path from 'path';
import runSequence from 'run-sequence';
import source from 'vinyl-source-stream';
import watchify from 'watchify';
import AnsiToHTML from 'ansi-to-html';
import gulpnunjucks from 'gulp-nunjucks';
import inlineSource from 'gulp-inline-source';
import htmlmin from 'gulp-htmlmin';
import rev from 'gulp-rev';
import revReplace from 'gulp-rev-replace';
import gulpdata from 'gulp-data';
import sass from 'gulp-sass';
import util from 'gulp-util';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import http from 'http';
import config from './config';
const $ = require('gulp-load-plugins')();
const views = require('./views');

const ansiToHTML = new AnsiToHTML();

const AUTOPREFIXER_BROWSERS = [
  'ie >= 8',
  'ff >= 30',
  'chrome >= 34',
  'iOS >= 7',
  'Safari >= 7',
];

const BROWSERIFY_ENTRIES = [
  'index.js',
];

const BROWSERIFY_TRANSFORMS = [
  'babelify',
  'debowerify',
];

const OTHER_SCRIPTS = [
  'components/core/top.js',
];

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const copyGlob = OTHER_SCRIPTS.concat([
  'client/**/*',
  '!client/**/*.{html,scss}',

  // REPLACE: if using imagmin
  // '!client/**/*.{jpg,png,gif,svg}',

]);

// helpers
let preventNextReload; // hack to keep a BS error notification on the screen
function reload() {
  if (preventNextReload) {
    preventNextReload = false;
    return;
  }

  browserSync.reload();
}

function handleBuildError(headline, error) {
  if (process.env.NODE_ENV === 'development') {
    // show in the terminal
    util.log(headline, error && error.stack);

    // report it in browser sync
    let report = (
      `<span style="color:red;font-weight:bold;font:bold 20px sans-serif">${headline}</span>`
    );

    if (error) {
      report += (
        `<pre style="text-align:left;max-width:800px">${ansiToHTML.toHtml(error.stack)}</pre>`
      );
    }

    browserSync.notify(report, 60 * 60 * 1000);
    preventNextReload = true;

    // allow the sass/js task to end successfully, so the process can continue
    this.emit('end');
  } else throw error;
}

// function to get an array of objects that handle browserifying
function getBundlers(useWatchify) {
  return BROWSERIFY_ENTRIES.map(entry => {
    const bundler = {
      b: browserify(path.posix.resolve('client', entry), {
        cache: {},
        packageCache: {},
        fullPaths: useWatchify,
        debug: useWatchify,
      }),

      execute() {
        const stream = this.b.bundle()
          .on('error', function browserifyError(error) {
            handleBuildError.call(this, 'Error building JavaScript', error);
          })
          .pipe(source(entry));

        // If you want JS sourcemaps:
        //    1. npm i -D gulp-sourcemaps
        //    2. uncomment code below
        //
        // skip sourcemap creation if we're in 'serve' mode
        // if (useWatchify) {
        //   stream = stream
        //    .pipe(vinylBuffer())
        //    .pipe(gulpsourcemaps.init({ loadMaps: true }))
        //    .pipe(gulpsourcemaps.write('./'));
        // }

        return stream.pipe(gulp.dest('dist'));
      },
    };

    // register all the transforms
    BROWSERIFY_TRANSFORMS.forEach(transform => bundler.b.transform(transform));

    // upgrade to watchify if we're in 'serve' mode
    if (useWatchify) {
      bundler.b = watchify(bundler.b);
      bundler.b.on('update', () => {
        // re-run the bundler then reload the browser
        bundler.execute().on('end', reload);
      });
    }

    return bundler;
  });
}

/**
 * The Tasks
 */

// makes a production build (client => dist)
gulp.task('default', done => {
  process.env.NODE_ENV = 'production';
  runSequence(
    ['scripts', 'styles', 'build-pages', 'copy'],
    ['html'/* 'images' */],
    ['revreplace'],
  done);
});

// runs a development server (serving up dist and client)
gulp.task('watch', ['styles', 'build-pages', 'copy'], done => {
  const bundlers = getBundlers(true);

  // execute all the bundlers once, up front
  const initialBundles = mergeStream(bundlers.map(bundler => bundler.execute()));
  initialBundles.resume(); // (otherwise never emits 'end')

  initialBundles.on('end', () => {
    // use browsersync to serve up the development app
    browserSync({
      notify: true,
      open: process.argv.includes('--open'),
      ui: process.argv.includes('--bsui'),
      ghostMode: process.argv.includes('--ghost'),
      port:'3000',
      server: {
        baseDir: 'dist',
      },
    });

    // refresh browser after other changes
    gulp.watch([
      'client/**/*.{html,md}',
      'views/**/*.{js,html}',
      'config/*.{js,json}'], ['build-pages', reload]);
    gulp.watch(['client/**/*.scss'], ['styles', reload]);
    gulp.watch(copyGlob, ['copy', reload]);

    // UNCOMMENT IF USING IMAGEMIN
    // gulp.watch(['client/images/**/*'], reload);

    done();
  });
});

// copies over miscellaneous files (client => dist)
gulp.task('copy', () =>
  gulp.src(copyGlob, { dot: true })
    .pipe(gulp.dest('dist'))
);

gulp.task('build-pages', () => {
  /// 删除一些缓冲文件/模块
  delete require.cache[require.resolve('./views')];
  /* require.resolve():Return the resolved filename
   * require.cache: type——Object; Modules are cached in this object when they are required. By deleting a key value from this object, the next require will reload the module
   */
  delete require.cache[require.resolve('./config/flags')];
  delete require.cache[require.resolve('./config/article')];
  delete require.cache[require.resolve('./config/index')];

  return gulp.src('client/**/*.html')
    .pipe(plumber())//防止管道因为来自gulp插件的错误而导致的中断
    //.pipe(gulpdata(async(d) => await require('./config').default(d)))
    .pipe(gulpdata(async(d) => await config(d)))
    /* async function 声明了一个异步函数，并返回了一个 AsyncFunction 对象。
     * 异步函数可能会包括  await 表达式，这将会使异步函数暂停执行并等待 promise 解析传值后，继续执行异步函数并返回解析值。
    */
    //.pipe(gulpdata(config()))
    .pipe(gulpnunjucks.compile(null, { env: views.configure() }))
    /* gulp-nunjucks: Compile/precompile Nunjucks templates
    */
    .pipe(gulp.dest('dist'));
});

// minifies all HTML, CSS and JS (dist & client => dist)
gulp.task('html', () =>
  gulp.src('dist/**/*.html')
    .pipe(inlineSource())
    .pipe(htmlmin({
      collapseWhitespace: true,
      processConditionalComments: true,
      minifyJS: true,
    }))
    .pipe(gulp.dest('dist'))
);

// task to do a straightforward browserify bundle (build only)
gulp.task('scripts', () =>
  mergeStream(getBundlers().map(bundler => bundler.execute()))
);

// builds stylesheets with sass/autoprefixer
gulp.task('styles', () =>
  gulp.src('client/**/*.scss')
    .pipe(plumber())
    .pipe($.sourcemaps.init({loadMaps:true}))
    .pipe(sass({
      includePaths: 'bower_components',
      outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded',
    }).on('error', function sassError(error) {
      handleBuildError.call(this, 'Error building Sass', error);
    }))

    .pipe(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
);

// renames asset files and adds a rev-manifest.json
gulp.task('revision', () =>
  gulp.src(['dist/**/*.css', 'dist/**/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist'))
);

// edits html to reflect changes in rev-manifest.json
gulp.task('revreplace', ['revision'], () =>
  gulp.src('dist/**/*.html')
    .pipe(revReplace({ manifest: gulp.src('./dist/rev-manifest.json') }))
    .pipe(gulp.dest('dist'))
);

// IMAGE COMPRESSION:
// OPTIONAL TASK IF YOU HAVE IMAGES IN YOUR PROJECT REPO
//  1. install gulp-imagemin:
//       $ npm i -D gulp-imagemin
//  2. uncomment task below
//  3. Find other commented out stuff related to imagemin elsewhere in this gulpfile
//
// gulp.task('images', () => gulp.src('dist/**/*.{jpg,png,gif,svg}')
//   .pipe(gulpimagemin({
//     progressive: true,
//     interlaced: true,
//   }))
//   .pipe(gulp.dest('dist'))
// );
function distServer() {
  const serveStatic = require('serve-static');
  const finalhandler = require('finalhandler');
  const serve = serveStatic('dist', {'index': ['index.html']})
  return http.createServer(function onRequest (req, res) {
    serve(req, res, finalhandler(req, res))
  });
}

gulp.task('test:install-selenium', done => {
  const selenium = require('selenium-standalone');
  selenium.install({}, done);
});

gulp.task('test:preflight', ['test:install-selenium'], () => {
  const nightwatch = require('nightwatch');

  if (process.env.CIRCLE_PROJECT_REPONAME === 'starter-kit') {
    console.info('Project is base starter-kit; bypassing preflight checks...');
    return process.exit();
  }

  if (process.env.CIRCLE_BUILD_NUM === 1) {
    console.info('Initial build; bypassing preflight checks...');
    return process.exit();
  }

  distServer().listen(process.env.PORT || '3000');

  return nightwatch.runner({ // eslint-disable-line consistent-return
    config: 'nightwatch.json',
    group: 'preflight',
  }, passed => {
    if (passed) {
      process.exit();
    } else {
      process.exit(1);
    }
  });
});
