'use strict';

const gulp = require('gulp');
const install = require('gulp-install');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const runSequence = require('run-sequence');
const gulpif = require('gulp-if');

let ROOT = process.cwd();
let CUSTOM_BOOTSTRAP_VARIABLES = '';
let CUSTOM_BOOTSTRAP_SCSS = '';

// ----------------------------------------
// Tasks
// ----------------------------------------

const tasks = {
  copy: (src, dest) => {
    return gulp.src(src)
      .pipe(gulp.dest(dest))
      .on('error', console.error);
  }
};

gulp.task('copy:css', () => tasks.copy(`${ROOT}/css/*-override.css`, `${ROOT}/dist/css`));
gulp.task('copy:fonts', () => tasks.copy(`${ROOT}/fonts/**/*.ttf`, `${ROOT}/dist/fonts`));
gulp.task('copy:images', () => tasks.copy(`${ROOT}/images/*`, `${ROOT}/dist/images`));

gulp.task('clean', () => {
  return gulp.src(`${ROOT}/dist`, { read: false })
    .pipe(clean({force: true}));
});

gulp.task('override:material-design', () => {
  return gulp.src(`${ROOT}/scss/overrides/material-design/material-design.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('material-design-override.css'))
    .pipe(gulp.dest(`${ROOT}/css`));
});

gulp.task('override:bootstrap', () => {
  const scss = `${ROOT}/scss/overrides/bootstrap`;

  let customVariables = `@import "custom";`;
  let customScss = '';

  if (CUSTOM_BOOTSTRAP_VARIABLES)
    customVariables += `\n@import "${CUSTOM_BOOTSTRAP_VARIABLES}";`;
  customVariables += `\n@import "${scss}/custom.scss";`;

  if (CUSTOM_BOOTSTRAP_SCSS) {
    customScss = `\n@import "${CUSTOM_BOOTSTRAP_SCSS}";`;
  }

  return gulp.src(`${ROOT}/bower_components/bootstrap/scss/bootstrap.scss`)
    .pipe(replace(/@import "custom";/, customVariables))
    .pipe(replace(/@import "buttons";/, `@import "buttons";\n@import "${scss}/buttons.scss";`))
    .pipe(replace(/@import "forms";/, `@import "forms";\n@import "${scss}/forms.scss";`))
    .pipe(replace(/@import "card";/, `@import "card";\n@import "${scss}/card.scss";`))
    .pipe(replace(/@import "modal";/, `@import "modal";\n@import "${scss}/modal.scss";`))
    .pipe(replace(/@import "utilities";/, `@import "utilities";\n${customScss}`))
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('bootstrap-override.css'))
    .pipe(gulp.dest(`${ROOT}/css`));
});

gulp.task('override:min', () => {
  return gulp.src([
    `${ROOT}/css/bootstrap-override.css`,
    `${ROOT}/css/material-design-override.css`
  ])
  .pipe(cleanCSS())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(`${ROOT}/dist/css`))
  .on('error', console.error);
});

gulp.task('sass', () => {
  return gulp.src(`${ROOT}/scss/style.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${ROOT}/css`))
    .on('error', console.log);
});

gulp.task('sass:watch', () => {
  gulp.watch([
    `${ROOT}/scss/**/*.scss`,
    `${ROOT}/scss/overrides/bootstrap/**/*.scss`,
    `${ROOT}/scss/overrides/material-design/**/*.scss`
  ], ['sass']);
});

gulp.task('dist', () => {
  runSequence(
    'clean',
    'sass',
    'override:bootstrap',
    'override:material-design',
    'override:min',
    'copy:css',
    'copy:fonts',
    'copy:images'
  );
});

gulp.task('install', () => {
  gulp.src([`${ROOT}/bower.json`, `${ROOT}/package.json`])
    .pipe(install());
});

// Exporting task to use inside another gulpfile, like a dependency...
module.exports = options => {
  ROOT = options.styleguidePath;
  CUSTOM_BOOTSTRAP_VARIABLES = options.bootstrapVariables;
  CUSTOM_BOOTSTRAP_SCSS = options.bootstrap;

  options.gulp.task('styleguide:install', () => gulp.start('install'));
  options.gulp.task('styleguide:build', () => gulp.start('dist'));
};
