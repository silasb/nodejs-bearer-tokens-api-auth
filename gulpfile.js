var gulp = require('gulp');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

gulp.task('jsx', function() {
  return gulp.src('public/javascripts/app.jsx', {read: false})
    .pipe(browserify({
      transform: ['reactify'],
      extensions: ['.jsx']
    }))
    .pipe(rename('app.js'))
    .pipe(gulp.dest('public/javascripts/'));
});

var nodemon = require('gulp-nodemon');

gulp.task('default', ['jsx'], function() {
  gulp.watch('public/javascripts/**/*.jsx', ['jsx'])

  nodemon({script: 'server.js', watch: 'server.js'})
})
