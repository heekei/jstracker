const gulp = require('gulp');
const connect = require('gulp-connect'); //静态服务器
const babel = require('gulp-babel');
// const clean = require('gulp-clean');

gulp.task('buildClient', function () {
    gulp.src(['client/**/*.js'])
        .pipe(babel({
            presets: ['es2015']
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