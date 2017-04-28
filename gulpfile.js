const gulp = require('gulp');
const sass = require('gulp-sass');

// ----------------------------------------
// Sass
// ----------------------------------------
gulp.task('sass', () => {
  return gulp.src([
    './scss/style.scss',
    './scss/overrides/bootstrap/bootstrap-override.scss',
    './scss/overrides/material-design/material-design-override.scss'
  ])
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', () => {
    gulp.watch([
      './scss/**/*.scss',
      './scss/overrides/bootstrap/**/*.scss',
      './scss/overrides/material-design/**/*.scss'
    ], ['sass']);
});
