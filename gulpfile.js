const gulp = require('gulp');
const babel = require('gulp-babel');
// const clean = require('gulp-clean');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const through2 = require('through2');

gulp.task('buildClient', function () {
  gulp.src(['src/client/**/*.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(through2.obj(function (file, enc, next) {
      browserify(file.path)
        // .transform(reactify)
        .bundle(function (err, res) {
          if (err) {
            if (err.stack) console.log(err.stack);
          } else {
            file.contents = res;
          }
          next(null, file);
        });
    }))
    .pipe(gulp.dest('build/client'));

});

gulp.task('buildServer', function () {
  gulp.src(['src/server/**/*'])
    .pipe(gulp.dest('build/server'));
});

gulp.task('db', function () {
  return gulp.src('src/server/db.json')
    .pipe(gulp.dest('database'));
});

/**
 * 生产任务
 */
gulp.task('build', ['buildClient', 'buildServer']);


/************************************************************** */


gulp.task('convertjs', function () {
  gulp.src(['src/**/*.js', '!src/server/**/*.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(through2.obj(function (file, enc, next) {
      browserify(file.path)
        .bundle(function (err, res) {
          if (err) {
            if (err.stack) console.log(err.stack);
          } else {
            file.contents = res;
          }
          next(null, file);
        });
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch(['./src/**/*.js'], ['convertjs']);
  gulp.watch(['server/db.json'], ['db']);
});

/**
 * 开发任务
 */
gulp.task('default', ['watch']);
