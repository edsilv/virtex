var c = require('../gulpfile.config');
var config = new c();
var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('test', ['sync'], function() {
    connect.server({
        root: './test',
        middleware: function(connect, opt) {
            return [
                //utils.mount(connect, config.dist), // serve contents of the dist folder
                //utils.mount(connect, './node_modules') // serve node_modules
            ]
        }
    });
});