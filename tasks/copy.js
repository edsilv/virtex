var c = require('../gulpfile.config');
var config = new c();
var gulp = require('gulp');
var merge = require('merge2');
var path = require('path');
var utils = require('gulp-utils');

gulp.task('copy:bundle', function() {
    return merge([
        gulp.src(path.join(config.dist, config.jsBundleOut))
            .pipe(gulp.dest(config.testDepsDir)),
        gulp.src(config.cssSrc)
            .pipe(gulp.dest(config.testCSSDir))
    ]);
});

gulp.task('copy:typings', function() {
    return gulp.src(config.typings).pipe(gulp.dest(config.typingsDir));
});

