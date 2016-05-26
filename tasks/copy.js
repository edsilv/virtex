var c = require('../gulpfile.config');
var config = new c();
var gulp = require('gulp');
var utils = require('gulp-utils');

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
