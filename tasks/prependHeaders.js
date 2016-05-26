var c = require('../gulpfile.config');
var config = new c();
var gulp = require('gulp');
var insert = require('gulp-insert');

function prependHeader(file, dest){
    return gulp.src(file)
            .pipe(insert.prepend(config.header))
            .pipe(gulp.dest(dest));
}

gulp.task('prependHeaders', function(cb){
    return Promise.all([
        prependHeader(config.dist + '/' + config.dtsOut, config.dist),
        prependHeader(config.dist + '/' + config.jsOut, config.dist),
        prependHeader(config.dist + '/' + config.name + '.min.js', config.dist)
    ]);
});

