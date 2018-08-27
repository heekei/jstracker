const gulp = require('gulp');
const connect = require('gulp-connect'); //静态服务器
const cors = require('cors');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
// const browserify = require('browserify');
// const source = require('vinyl-source-stream');

gulp.task('convertjs', function () {
    gulp.src(['client/**/*.js', '!client/libs/**/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
    // gulp.task('browserify')();
});

gulp.task('concatjs', function () {
    gulp.src(['client/libs/**/*.js', 'client/**/*.js'])
        .pipe(concat('jstracker.bundle.js'))
        .pipe(gulp.dest('build/client'));
});

gulp.task('copylibs', function () {
    gulp.src('client/libs/**/*.js')
        .pipe(gulp.dest('dist/libs'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src('client/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('server', function () {
    connect.server({
        root: 'dist',
        livereload: true,
        port: 3001,
        middleware: function () {
            return [cors()];
        }
    });
});
gulp.task('watch', function () {
    gulp.watch(['client/**/*.js', '!client/libs/**/*.js'], ['convertjs']);
    gulp.watch(['client/libs/**/*.js'], ['copylibs']);
    gulp.watch(['client/**/*.html'], ['html']);
});

gulp.task('subBuild', function () {
    gulp.src(['client/**/*.js', '!client/libs/**/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('build/client'));

    gulp.src(['client/libs/**/*.js'])
        .pipe(gulp.dest('build/client'));

    gulp.src(['server/**/*'])
        .pipe(gulp.dest('build/server'));
});
gulp.task('clean', function () {
    gulp.src('build', {
        read: false
    }).pipe(clean());
});

gulp.task('clean', function () {
    gulp.src('dist/', {
        read: false
    }).pipe(clean());
});

gulp.task('build', ['clean', 'subBuild', 'concatjs']);

gulp.task('default', ['server', 'html', 'convertjs', 'copylibs', 'watch']);