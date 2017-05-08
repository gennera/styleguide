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



---

# NEW!

### 1 - Add to bower dependencies:
```js
"dependencies": {
  "genneraapps-styleguide": "git@github.com:gennera/styleguide.git"
}
```

### 2 - Run this command line:
##### PS: This command will install automatically 'jquery, font-awesome, material-design-icons and bootstrap', like a dependency.
```sh
bower install
```

### 3 - ?
```html
<!-- Stylesheets -->
<link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.css" media="screen" charset="UTF-8">
<link rel="stylesheet" href="bower_components/material-design-icons/iconfont/material-icons.css" media="screen" charset="UTF-8">
<link rel="stylesheet" href="bower_components/genneraapps-styleguide/dist/css/material-design-override.css" media="screen" charset="UTF-8">
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-reboot.css" media="screen" charset="UTF-8">
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" media="screen" charset="UTF-8">
<link rel="stylesheet" href="bower_components/genneraapps-styleguide/dist/css/bootstrap-override.css" media="screen" charset="UTF-8">

<!-- Scripts -->
<script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js" charset="UTF-8"></script>
<script type="text/javascript" src="bower_components/tether/dist/js/tether.min.js" charset="UTF-8"></script>
<script type="text/javascript" src="bower_components/bootstrap/dist/js/bootstrap.min.js" charset="UTF-8"></script>
```

### 4 - ?
```js
...
```

### 5 - ?
```js
...
```