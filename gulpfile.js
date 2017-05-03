const gulp = require('gulp');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const rename = require('gulp-rename');

// ----------------------------------------
// Sass
// ----------------------------------------
gulp.task('sass', ['override:bootstrap', 'override:material-design'], () => {
  return gulp.src([
    './scss/style.scss'
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

gulp.task('override:material-design', () => {
  return gulp.src([
    `${process.cwd()}/scss/overrides/material-design/material-design.scss`
  ])
  .pipe(sass().on('error', sass.logError))
  .pipe(rename('material-design-override.css'))
  .pipe(gulp.dest('./css'));
});

gulp.task('override:bootstrap', () => {
  const scss = `${process.cwd()}/scss/overrides/bootstrap`;

  return gulp.src([ `${process.cwd()}/bower_components/bootstrap/scss/bootstrap.scss` ])
    .pipe(replace(/@import "custom";/, `@import "${scss}/custom.scss";`))
    .pipe(replace(/@import "buttons";/, `@import "buttons";\n@import "${scss}/buttons.scss";`))
    .pipe(replace(/@import "forms";/, `@import "forms";\n@import "${scss}/forms.scss";`))
    .pipe(replace(/@import "card";/, `@import "card";\n@import "${scss}/card.scss";`))
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('bootstrap-override.css'))
    .pipe(gulp.dest('./css'));
});
