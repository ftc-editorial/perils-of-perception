const fs = require('mz/fs');
const path = require('path');
const co = require('co');
const render = require('./utils/render.js');
const mkdir = require('./utils/mkdir.js');

const del = require('del');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');
const merge = require('merge-stream');
const footer = require('./bower_components/ftc-footer');

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
      yield mkdir(destDir);
    } catch (e) {
      console.log(e);
    }

    const prod = process.env.NODE_ENV === 'prod';
    const flags = {
      prod,
      analytics: prod
    };
    const article = yield fs.readFile('./data/article.json', 'utf8');

    const context = Object.assign(JSON.parse(article), {
      flags,
      footer
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

  const sassOptions = {
    outputStyle: 'expanded',
    precision: 10,
    includePaths: ['bower_components']
  };

  if (process.env.NODE_ENV === 'prod') {
    sassOptions.outputStyle = 'compressed';
  }

  return gulp.src('client/styles.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init({loadMaps:true}))
    .pipe($.sass({
      outputStyle: 'compressed',
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
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
    webpackConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')}));
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
  const core = gulp.src('client/components/core/top.*')
    .pipe(gulp.dest('.tmp/components/core'));
  const data = gulp.src('data/cn/*')
    .pipe(gulp.dest('.tmp/data'));


  return merge(core, data);
});

gulp.task('copyad',()=>{
  const adjs = gulp.src('client/components/ad/ad.js')
    .pipe(gulp.dest('.tmp/scripts'));
  const adhtml = gulp.src('m/marketing/*.html')
    .pipe(gulp.dest('.tmp/m/marketing'));
  return merge(adjs,adhtml);
})
gulp.task('serve', 
  gulp.parallel(
    'copy', 'copyad','build-pages', 'styles', 'webpack',

    function serve() {
    browserSync.init({
      server: {
        baseDir: ['.tmp'],
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

gulp.task('build', gulp.series('clean', 'prod', gulp.parallel(
    'copy', 'build-pages', 'styles', 'webpack'), 'dev'));

gulp.task('html', () => {
  return gulp.src('.tmp/*.html')
    .pipe($.inlineSource())
    .pipe($.htmlmin({
      collapseWhitespace: true,
      processConditionalComments: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('demo-copy', () => {
  const dest = path.resolve(__dirname, '../ft-interact/', path.basename(__dirname));

  return gulp.src(['.tmp/*.html', '.tmp/**/*.json'])
    .pipe(gulp.dest(dest));
});

gulp.task('demo', gulp.series('build', 'html', 'demo-copy'));

gulp.task('deploy-html', () => {
  const dest = path.resolve(__dirname, '../special/', path.basename(__dirname));

  return gulp.src('.tmp/*.html')
    .pipe(gulp.dest(dest));
});

gulp.task('deploy-json', () => {
  return gulp.src('.tmp/**/*.json')
    .pipe(gulp.dest('../'))
});

gulp.task('deploy', gulp.series('build', 'html', 'deploy-html', 'deploy-json'));