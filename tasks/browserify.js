var c = require('../gulpfile.config');
var config = new c();
var gulp = require('gulp');
var rename = require('gulp-rename');
var utils = require('gulp-utils');

gulp.task('browserify', function(cb) {
    return gulp.src(config.fileNames.jsOut, {cwd: config.browserify.src})
        .pipe(utils.bundle(config.browserify.config))
        .pipe(rename(config.fileNames.jsOut))
        .pipe(gulp.dest(config.browserify.target));
});