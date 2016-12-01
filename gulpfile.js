'use strict';



////////////////////////
// INIT
////////////////////////

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');

const webpack = require("webpack");
const webpackDevConfig = require("./webpack.dev.config.js");
const webpackDistConfig = require("./webpack.dist.config.js");

const browserSync = require('browser-sync');
const reload = browserSync.reload;



////////////////////////
// UTILITIES
////////////////////////

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('default', ['clean'], () => {
  gulp.start('build:dist');
});



////////////////////////
// DEVELOPMENT
////////////////////////

const devCompiler = webpack(webpackDevConfig);

gulp.task('build:dev', (callback) => {
  devCompiler.run(function(err, stats) {
		if(err) throw new $.util.PluginError("webpack:build", err);
    callback();
	});
});

gulp.task('serve', ['build:dev'], () => {
  browserSync({
    notify: false,
    port: 3000,
    server: {
      baseDir: ['.tmp', 'src']
    }
  });
  gulp.watch('src/**/*.*', ['build:dev', reload]);
});



////////////////////////
// DISTRIBUTION
////////////////////////

gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('extras', () => {
  return gulp.src([
    'src/*.*',
    '!src/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('build:dist', ['html', 'extras'], (callback) => {
  webpack(webpackDistConfig, function(err, stats) {
		if(err) throw new $.util.PluginError("webpack:build", err);
    callback();
	});
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 3000,
    server: {
      baseDir: ['dist']
    }
  });
});



////////////////////////
// OLD
////////////////////////

// gulp.task('build', ['lint', 'html', 'images', 'extras'], () => {
//   return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
// });

// gulp.task('styles', function() {
//   return gulp.src('src/css/*.scss')
//     .pipe($.plumber())
//     .pipe($.sourcemaps.init())
//     .pipe($.sass.sync({
//       outputStyle: 'expanded',
//       precision: 10,
//       includePaths: ['.']
//     }).on('error', $.sass.logError))
//     .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
//     .pipe($.sourcemaps.write())
//     .pipe(gulp.dest('.tmp/css'))
//     .pipe(reload({stream: true}));
// });

// gulp.task('scripts', function() {
//   return gulp.src('app/scripts/main.js')
//     .pipe(webpack( require('./webpack.config.js') ))
//     .pipe(gulp.dest('.tmp/scripts'))
//     .pipe(reload({stream: true}));
// });

// gulp.task('templates', () => {
//   return gulp.src('app/scripts/**/*.jsx')
//     .pipe($.plumber())
//     .pipe($.sourcemaps.init())
//     .pipe($.babel({
//       presets: ['es2015','react']
//     }))
//     .pipe($.sourcemaps.write())
//     .pipe(gulp.dest('.tmp/scripts'))
//     .pipe(reload({stream: true}));
// });
