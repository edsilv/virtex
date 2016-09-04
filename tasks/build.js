var c = require('../gulpfile.config');
var config = new c();
var concat = require('gulp-concat');
var gulp = require('gulp');
var merge = require('merge2');
var ts = require('gulp-typescript');

gulp.task('build', function() {
    var result = gulp.src(config.typescript.src)
        .pipe(ts(config.typescript.config));

    return merge([
        result.dts
            .pipe(concat(config.fileNames.dtsOut))
            .pipe(gulp.dest(config.directories.dist)),
        result.js
            .pipe(concat(config.fileNames.jsOut))
            .pipe(gulp.dest(config.directories.dist))
    ]);
});