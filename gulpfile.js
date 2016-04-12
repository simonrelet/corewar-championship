'use strict';

const gulp = require('gulp');
const markdown = require('gulp-markdown');
const del = require('del');
const sync = require('gulp-npm-script-sync');
const sass = require('gulp-sass');
const jade = require('gulp-jade');
const data = require('gulp-data');
const path = require('path');
const rename = require('gulp-rename');
const fsp = require('fs-promise');

const paths = {
  modules: 'node_modules',
  dist: 'dist/public',
  md: 'views/markdown/**/*.md',
  svg: 'public/**/*.svg',
  svgJade: 'public/images/**/!(_)*.jade',
  svgJadeAll: 'public/images/**/*.+(jade|json)',
  js: 'public/**/*.js',
  css: 'public/**/*.scss',
  generated: 'views/generated',
  logs: 'logs'
};

gulp.task('build:md', () => {
  return gulp.src(paths.md)
    .pipe(markdown())
    .pipe(gulp.dest(paths.generated));
});

gulp.task('build:svg:jade', () => {
  return gulp.src(paths.svgJade)
    .pipe(data((file, cb) => {
      fsp.readJson(`${path.dirname(file.path)}/${path.basename(file.path, '.jade')}.json`)
        .then(content => cb(undefined, content));
    }))
    .pipe(jade({
      pretty: true,
    }))
    .pipe(rename(path => {
      path.extname = '.svg';
    }))
    .pipe(gulp.dest(`${paths.dist}/images`));
});

gulp.task('build:svg', ['build:svg:jade'], () => {
  return gulp.src(paths.svg)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build:js', () => {
  return gulp.src(paths.js)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build:css', () => {
  return gulp.src(paths.css)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['build:md', 'build:svg', 'build:js', 'build:css'], done => {
  done();
});

gulp.task('clean', () => {
  return del([paths.dist, paths.generated, paths.logs]);
});

gulp.task('clean:dist', ['clean'], () => {
  return del([paths.modules]);
});

gulp.task('watch', ['build'], () => {
  gulp.watch(paths.md, ['build:md']);
  gulp.watch(paths.css, ['build:css']);
  gulp.watch(paths.svgJadeAll, ['build:svg:jade']);
});

sync(gulp, {
  excluded: ['build:md', 'build:svg', 'build:svg:jade', 'build:js', 'build:css']
});
