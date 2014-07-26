var gulp = require('gulp');
var react = require('gulp-react');

gulp.task('jsx', function() {
  return gulp.src('public/javascripts/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('public/javascripts/'));
});

var nodemon = require('gulp-nodemon');

gulp.task('watch', function() {
  gulp.watch('public/javascripts/*.jsx', ['jsx'])

  nodemon({script: 'server.js', watch: 'server.js'})
})
