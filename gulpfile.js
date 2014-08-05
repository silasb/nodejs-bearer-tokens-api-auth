var gulp = require('gulp');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var nodemon = require('gulp-nodemon');

gulp.task('jsx', function() {
  return gulp.src('client/javascripts/app.jsx', {read: false})
    .pipe(browserify({
      transform: ['reactify'],
      extensions: ['.jsx']
    }))
    .pipe(rename('app.js'))
    .pipe(gulp.dest('public/javascripts/'));
});

gulp.task('default', ['jsx'], function() {
  gulp.watch('client/javascripts/**/*.jsx', ['jsx'])

  nodemon({script: 'server.js', watch: 'server.js'})
})
