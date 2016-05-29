var c = require('../gulpfile.config');
var config = new c();
var gulp = require('gulp');
var utils = require('gulp-utils');

gulp.task('copy:css', function() {
    return gulp.src('src/*.css')
        .pipe(gulp.dest(config.dist))
        .pipe(gulp.dest('./test/css'));
});

gulp.task('copy:build', function() {
    return gulp.src([
        config.dist + '/' + config.jsOut,
        config.dist + '/' + config.name + '.min.js'
    ]).pipe(gulp.dest(config.testDepsDir));
});

gulp.task('copy:deps', function() {
    return gulp.src(config.deps.concat(config.testDeps)).pipe(gulp.dest(config.testDepsDir));
});

gulp.task('copy:typings', function() {
    return gulp.src(config.typings).pipe(gulp.dest(config.typingsDir));
});
