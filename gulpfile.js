var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var Config = require('./gulpfile.config');
var config = new Config();
var connect = require('gulp-connect');
var del = require('del');
var eventStream = require('event-stream');
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
            target: 'es3',
            module: 'amd',
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
            transform: ['deamdify'],
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

function mount(connect, dir) {
    return connect.static(path.resolve(dir));
}

gulp.task('test', function() {
    connect.server({
        root: './test',
        middleware: function(connect, opt) {
            return [
                // serve contents of the dist folder
                mount(connect, config.dist)
            ]
        }
    });
});

gulp.task('default', function(cb) {
    runSequence('clean:dist', 'build', 'browserify', cb);
});