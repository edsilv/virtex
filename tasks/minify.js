var c = require('../gulpfile.config');
var config = new c();
var gulp = require('gulp');
var utils = require('gulp-utils');
var path = require('path');

gulp.task('minify', function(cb){
    Promise.all([
        utils.minify(path.join(config.dist, config.jsOut), config.dist)
    ]).then(function(){
        cb();
    });
});