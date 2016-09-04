var c = require('../gulpfile.config');
var config = new c();
var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('examples', ['sync'], function() {
    connect.server({
        root: config.directories.examples,
        middleware: function(connect, opt) {
            return [
                //utils.mount(connect, config.dist) // serve contents of the dist folder
                //utils.mount(connect, './node_modules') // serve node_modules
            ]
        }
    });
});