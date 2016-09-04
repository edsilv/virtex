var c = require('../gulpfile.config');
var config = new c();
var gulp = require('gulp');
var path = require('path');
var utils = require('gulp-utils');

gulp.task('prependHeaders', function(cb){
    Promise.all([
        utils.prependHeader(config.header, path.join(config.directories.dist, config.fileNames.dtsOut), config.directories.dist),
        utils.prependHeader(config.header, path.join(config.directories.dist, config.fileNames.jsOut), config.directories.dist),
        utils.prependHeader(config.header, path.join(config.directories.dist, config.fileNames.jsMinOut), config.directories.dist)
    ]).then(function(){
        cb();
    });
});