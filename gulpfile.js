'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
  browserSync({
    files: ['src/**/*.*'],
    server: {
      baseDir: './src/'
    }
  });
});

// use default task to launch BrowserSync and watch JS files
gulp.task('default', ['browser-sync']);
