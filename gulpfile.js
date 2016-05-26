var c = require('./gulpfile.config');
var config = new c();
var gulp = require('gulp');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');
var tasks = requireDir('./tasks');

gulp.task('default', function(cb) {
    runSequence('clean:dist', 'build', 'browserify', 'copy:css', 'minify', 'prependHeaders', 'copy:build', cb);
});

gulp.task('sync', ['copy:typings', 'copy:libs']);