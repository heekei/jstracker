const gulp = require('gulp');
const connect = require('gulp-connect'); //静态服务器
const babel = require('gulp-babel');
// const clean = require('gulp-clean');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const through2 = require('through2');

gulp.task('buildClient', function () {
    gulp.src(['client/**/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(through2.obj(function (file, enc, next) {
            browserify(file.path)
                // .transform(reactify)
                .bundle(function (err, res) {
                    err && console.log(err.stack);
                    file.contents = res;
                    next(null, file);
                });
        }))
        .pipe(gulp.dest('build/client'));

});

gulp.task('buildServer', function () {
    gulp.src(['server/**/*'])
        .pipe(gulp.dest('build/server'));
});

gulp.task('db', function () {
    return gulp.src('server/db.json')
        .pipe(gulp.dest('database'));
});

/**
 * 生产任务
 */
gulp.task('build', ['buildClient', 'buildServer']);


/************************************************************** */


gulp.task('convertjs', function () {
    gulp.src(['client/**/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(through2.obj(function (file, enc, next) {
            browserify(file.path)
                // .transform(reactify)
                .bundle(function (err, res) {
                    err && console.log(err.stack);
                    file.contents = res;
                    next(null, file);
                });
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['client/**/*.js'], ['convertjs']);
    gulp.watch(['server/db.json'], ['db']);
});

/**
 * 开发任务
 */
gulp.task('default', ['watch']);