'use strict';

const path = require('path');
const gulp = require('gulp');
const install = require('gulp-install');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const gulpif = require('gulp-if');

let ROOT = process.cwd();
let CUSTOM_BOOTSTRAP_VARIABLES = '';
let CUSTOM_BOOTSTRAP_SCSS = '';

const join = function (a, b) {
  return path.join(a, b);
};

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

gulp.task('copy:css', () => tasks.copy(join(ROOT, '/css/*-override.css'), join(ROOT, '/dist/css')));
gulp.task('copy:fonts', () => tasks.copy(join(ROOT, '/fonts/**/*.ttf'), join(ROOT, '/dist/fonts')));
gulp.task('copy:images', () => tasks.copy(join(ROOT, '/images/*'), join(ROOT, '/dist/images')));

gulp.task('clean', () => {
  return gulp.src(join(ROOT, `/dist`), { read: false })
    .pipe(clean({force: true}));
});

gulp.task('override:material-design', () => {
  return gulp.src(join(ROOT, `/scss/overrides/material-design/material-design.scss`))
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('material-design-override.css'))
    .pipe(gulp.dest(join(ROOT, `/css`)));
});

gulp.task('override:bootstrap', () => {
  const SCSS = join(ROOT, '/scss/overrides/bootstrap');
  return gulp.src(join(ROOT, '/node_modules/bootstrap/scss/bootstrap.scss'))
    .pipe(gulpif(!!CUSTOM_BOOTSTRAP_SCSS, replaceImport('utilities', CUSTOM_BOOTSTRAP_SCSS)))
    .pipe(replaceImport('custom', '/custom.scss', SCSS))
    .pipe(gulpif(!!CUSTOM_BOOTSTRAP_VARIABLES, replaceImport('custom', CUSTOM_BOOTSTRAP_VARIABLES)))
    .pipe(replaceImport('reboot', '/reboot.scss', SCSS))
    .pipe(replaceImport('buttons', '/buttons.scss', SCSS))
    .pipe(replaceImport('forms', '/forms.scss', SCSS))
    .pipe(replaceImport('card', '/card.scss', SCSS))
    .pipe(replaceImport('modal', '/modal.scss', SCSS))
    .pipe(replace(/\\/g, '\\\\'))
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('bootstrap-override.css'))
    .pipe(gulp.dest(join(ROOT, '/css')));
});

const replaceImport = (existentFileName, newFile, path) => {
  const newFilePath = path ? join(path, newFile) : newFile;
  return replace(new RegExp(`@import "${existentFileName}";`), `@import "${existentFileName}";\n@import "${newFilePath}";`);
};

gulp.task('override:min', () => {
  return gulp.src([
    join(ROOT, `/css/bootstrap-override.css`),
    join(ROOT, `/css/material-design-override.css`)
  ])
  .pipe(cleanCSS())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(join(ROOT, `/dist/css`)))
  .on('error', console.error);
});

gulp.task('sass', () => {
  return gulp.src(join(ROOT, `/scss/style.scss`))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(join(ROOT, `/css`)))
    .on('error', console.log);
});

gulp.task('sass:watch', () => {
  gulp.watch([
    join(ROOT, `/scss/**/*.scss`),
    join(ROOT, `/scss/overrides/bootstrap/**/*.scss`),
    join(ROOT, `/scss/overrides/material-design/**/*.scss`)
  ], ['sass']);
});

gulp.task('dist', gulp.series('clean', 'sass', 'override:bootstrap', 'override:material-design', 'override:min', 'copy:css', 'copy:fonts', 'copy:images'));

gulp.task('install', () => {
  return gulp.src(join(ROOT, '/package.json'))
    .pipe(install());
});

// Exporting task to use inside another gulpfile, like a dependency...
module.exports = options => {
  ROOT = options.styleguidePath;
  CUSTOM_BOOTSTRAP_VARIABLES = options.bootstrapVariables;
  CUSTOM_BOOTSTRAP_SCSS = options.bootstrap;

  options.gulp.task('styleguide:install', () => gulp.series('install'));
  options.gulp.task('styleguide:build', () => gulp.series('dist'));
};
