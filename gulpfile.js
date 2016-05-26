var c = require('./gulpfile.config');
var config = new c();
var connect = require('gulp-connect');
var gulp = require('gulp');
var rename = require('gulp-rename');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');
var tasks = requireDir('./tasks');
var utils = require('gulp-utils');

gulp.task('browserify', function(cb) {
    return gulp.src(config.jsOut, {cwd: config.browserifySrc})
        .pipe(utils.bundle(config.browserifyConfig))
        .pipe(rename(config.jsOut))
        .pipe(gulp.dest(config.browserifyTarget));
});

gulp.task('minify', function(cb){
    Promise.all([
        utils.minify(config.dist + '/' + config.jsOut, config.dist)
    ]).then(function(){
        cb();
    });
});

gulp.task('prependHeaders', function(cb){
    Promise.all([
        utils.prependHeader(config.header, config.dist + '/' + config.dtsOut, config.dist),
        utils.prependHeader(config.header, config.dist + '/' + config.jsOut, config.dist),
        utils.prependHeader(config.header, config.dist + '/' + config.name + '.min.js', config.dist)
    ]).then(function(){
        cb();
    });
});

gulp.task('copy:css', function() {
    return gulp.src('src/*.css')
        .pipe(gulp.dest(config.dist))
        .pipe(gulp.dest('./test/css'));
});

gulp.task('copy:build', function() {
    return gulp.src([
        config.dist + '/' + config.jsOut,
        config.dist + '/' + config.name + '.min.js'
    ]).pipe(gulp.dest('./test/js'));
});

gulp.task('copy:libs', function() {
    return gulp.src([
        'node_modules/three/three.min.js',
        'node_modules/three/examples/js/controls/VRControls.js',
        'node_modules/three/examples/js/effects/VREffect.js',
        'node_modules/three/examples/js/libs/stats.min.js',
        'node_modules/three/examples/js/Detector.js',
        //'node_modules/webvr-boilerplate/build/webvr-manager.js',
        'node_modules/webvr-polyfill/build/webvr-polyfill.js',
        'node_modules/key-codes/dist/key-codes.js'
    ]).pipe(gulp.dest('./test/js'));
});

gulp.task('copy:typings', function() {
    return gulp.src([
        'node_modules/key-codes/dist/key-codes.d.ts'
    ]).pipe(gulp.dest('./typings'));
});

gulp.task('test', function() {
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

gulp.task('default', function(cb) {
    runSequence('clean:dist', 'build', 'browserify', 'copy:css', 'minify', 'prependHeaders', 'copy:build', cb);
});

gulp.task('sync', ['copy:typings', 'copy:libs']);