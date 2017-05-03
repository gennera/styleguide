# Getting Started


### 1 - Install dependencies
```sh
npm install --save gulp-sass gulp-replace gulp-rename
```

### 2 - Copy folder '/scss/overrides/bootstrap' into your project.

### 3 - Include the gulp task below into your 'gulpfile.js':
##### PS: Don't forget to change the directories path inside gulp task.
```js
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
```

### 4 - Run gulp task:
```sh
gulp override:bootstrap
```