var c = require('../gulpfile.config');
var config = new c();
var gulp = require('gulp');
var merge = require('merge2');
var path = require('path');
var utils = require('gulp-utils');

// test bundle
// gulp.task('copy:bundle', function() {
//     return gulp.src([path.join(config.directories.dist, config.fileNames.jsBundleOut)].concat(config.dependencies.examples)).pipe(gulp.dest(config.directories.examplesJs));
// });

// test unbundled js
gulp.task('copy:bundle', function() {
    return gulp.src([path.join(config.directories.dist, config.fileNames.jsOut)].concat(config.dependencies.libs).concat(config.dependencies.examples)).pipe(gulp.dest(config.directories.examplesJs));
});

gulp.task('copy:typings', function() {
    return gulp.src(config.dependencies.typings).pipe(gulp.dest(config.directories.typings));
});

gulp.task('copy:css', function() {
    return gulp.src([path.join(config.directories.dist, config.fileNames.cssOut)]).pipe(gulp.dest(config.directories.examplesCss));
});

gulp.task('copy:img', function() {
    return gulp.src(config.sources.img).pipe(gulp.dest(config.directories.examplesImg));
});

