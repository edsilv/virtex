var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var Config = require('./gulpfile.config');
var config = new Config();
var connect = require('gulp-connect');
var del = require('del');
var gulp = require('gulp');
var insert = require('gulp-insert');
var merge = require('merge2');
var path = require('path');
var rename = require('gulp-rename');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');
var tasks = requireDir('./tasks');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');

gulp.task('build', function() {
    var result = gulp.src(config.tsSrc)
        .pipe(ts({
            declarationFiles: true,
            noExternalResolve: true,
            noLib: false,
            module: 'commonjs',
            sortOutput: true
        }));

    return merge([
        result.dts
            .pipe(concat(config.dtsOut))
            .pipe(gulp.dest(config.dist)),
        result.js
            .pipe(concat(config.jsOut))
            .pipe(gulp.dest(config.dist))
    ]);
});

gulp.task('browserify', function (cb) {
    return gulp.src(['./*.js'], { cwd: config.dist })
        .pipe(browserify({
            standalone: config.lib
        }))
        .pipe(rename(config.jsOut))
        .pipe(gulp.dest(config.dist));
});

gulp.task('clean:dist', function (cb) {
    del([
        config.dist + '/*'
    ], cb);
});

gulp.task('minify', function() {
    return gulp.src([config.out], { cwd: config.dist })
        .pipe(rename(function (path) {
            path.extname = ".min" + path.extname;
        }))
        .pipe(uglify())
        .pipe(insert.prepend(config.header))
        .pipe(gulp.dest(config.dist));
});

gulp.task('copy:css', function() {
    return gulp.src('src/*.css')
        .pipe(gulp.dest(config.dist))
        .pipe(gulp.dest('./test/css'));
});

gulp.task('copy:build', function() {
    return gulp.src([
        'dist/virtex.js'
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

function mount(connect, dir) {
    return connect.static(path.resolve(dir));
}

gulp.task('test', function() {
    connect.server({
        root: './test',
        middleware: function(connect, opt) {
            return [
                //mount(connect, config.dist), // serve contents of the dist folder
                //mount(connect, './node_modules') // serve node_modules
            ]
        }
    });
});

gulp.task('default', function(cb) {
    runSequence('clean:dist', 'build', 'browserify', 'copy:css', 'copy:build', cb);
});

gulp.task('sync', function(cb) {
    runSequence('copy:typings', 'copy:libs', cb);
});