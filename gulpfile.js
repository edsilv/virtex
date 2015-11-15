var c = require('./gulpfile.config');
var concat = require('gulp-concat');
var config = new c();
var connect = require('gulp-connect');
var gulp = require('gulp');
var merge = require('merge2');
var path = require('path');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var tasks = requireDir('./tasks');
var ts = require('gulp-typescript');

gulp.task('build:dev', function() {

    var result = gulp.src([
        './src/*.ts',
        './src/**/*.ts',
        '!./lib/**/*.ts',
        './typings/*.ts'
    ])
        .pipe(sourcemaps.init())
        .pipe(ts({
            //sortOutput: true,
            module: 'amd',
            target: 'es5',
            declaration: true,
            noExternalResolve: true
        }));

    return merge([
        result.dts
            .pipe(concat(config.dtsOut))
            .pipe(gulp.dest(config.build)),
        result.js
            .pipe(concat(config.jsOut))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.build))
    ]);
});

gulp.task('build:test', function() {

    var result = gulp.src([
        './test/*.ts',
        './.build/*.d.ts',
        './typings/*.ts'
    ])
        .pipe(sourcemaps.init())
        .pipe(ts({
            sortOutput: true,
            module: 'amd',
            target: 'es5'
        }));

    return result.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./test'));
});

gulp.task('build:dist', function() {

    var result = gulp.src([
            './src/*.ts',
            './src/**/*.ts',
            '!./lib/**/*.ts',
            './typings/*.ts'
        ])
        .pipe(ts({
            sortOutput: true,
            module: 'amd',
            target: 'es5',
            declaration: true
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

function mount(connect, dir) {
    return connect.static(path.resolve(dir));
}

gulp.task('test', function() {
    connect.server({
        root: './test',
        middleware: function(connect, opt) {
            return [
                // serve contents of the dist folder
                mount(connect, './')
            ]
        }
    });
});

gulp.task('default', function(cb) {
    runSequence('build:dev', 'build:test', cb);
});

gulp.task('dist', function(cb) {
    runSequence('build:dist', cb);
});