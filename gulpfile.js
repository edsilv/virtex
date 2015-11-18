var browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    Config = require('./gulpfile.config'),
    config = new Config(),
    connect = require('gulp-connect'),
    del = require('del'),
    eventStream = require('event-stream'),
    gulp = require('gulp');
    insert = require('gulp-insert'),
    path = require('path'),
    rename = require('gulp-rename'),
    requireDir = require('require-dir'),
    runSequence = require('run-sequence'),
    tasks = requireDir('./tasks'),
    ts = require('gulp-typescript'),
    uglify = require('gulp-uglify');

gulp.task('build', function() {
    var tsResult = gulp.src(['src/*.ts', '!src/*.d.ts'])
        .pipe(ts({
            declarationFiles: true,
            noExternalResolve: true,
            module: 'amd',
            sortOutput: true
        }));

    return eventStream.merge(
        tsResult.dts.pipe(gulp.dest(config.dist)),
        tsResult.js.pipe(gulp.dest(config.dist))
    );
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
    runSequence('clean:dist', 'build', 'browserify', 'concat', cb);
});