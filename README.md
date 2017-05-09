# Getting Started

### 1 - Install NPM dependencies
```sh
npm install --save-dev gulp
```

### 2 - Add to bower dependencies:
```js
"dependencies": {
  "genneraapps-styleguide": "git@github.com:gennera/styleguide.git#1.1.0"
}
```

### 3 - Install Bower dependencies
##### PS: This command will install automatically 'jquery, font-awesome, material-design-icons and bootstrap', like a dependency.
```sh
bower install
```

### 4 - Import HTML dependencies
##### Note, Isn't necessary import default bootstrap, because the override is a new 'build' of bootstrap
```html
<!-- Stylesheets -->
<link href="bower_components/font-awesome/css/font-awesome.css">
<link href="bower_components/material-design-icons/iconfont/material-icons.css">
<link href="bower_components/genneraapps-styleguide/dist/css/material-design-override.css">
<link href="bower_components/genneraapps-styleguide/dist/css/bootstrap-override.css">

<!-- Scripts -->
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/tether/dist/js/tether.min.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
```

### 4 - Copy the following task to your gulpfile.js
```js
const gulp = require('gulp');
const ROOT = process.cwd();

require(`${ROOT}/bower_components/genneraapps-styleguide/gulpfile.js`)({
  // Required!
  gulp: gulp,

  // Required!
  styleguidePath: `${ROOT}/bower_components/genneraapps-styleguide`,
  
  // Path to your custom.scss
  bootstrap: `${ROOT}/scss/bootstrap/custom.scss`
});

gulp.task('styleguide', () => gulp.start('build:styleguide'));
```

### 5 - Enjoy!
```sh
gulp styleguide
```
