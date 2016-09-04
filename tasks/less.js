var c = require('../gulpfile.config');
var config = new c();
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var rename = require('gulp-rename');
 
gulp.task('less', function () {
  return gulp.src(config.sources.css)
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(rename(config.fileNames.cssOut))
    .pipe(gulp.dest(config.directories.dist));
});