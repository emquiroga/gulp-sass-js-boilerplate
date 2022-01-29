'use strict'
//Module imports
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

//SASS
function watchSass() {
    return src('app/scss/style.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('dist', { sourcemaps: '.' }))
}

//JavaScript
function watchJS() {
    return src('app/js/index.js', { sourcemaps: true })
        .pipe(babel({ presets: ['@babel/preset-env']}))
        .pipe(terser())
        .pipe(dest('dist', { sourcemaps: '.'}))
}

//Live server
function browserSyncServe(cb) {
    browserSync.init({
        server : {
            baseDir: '.'
        },
        notify: {
            styles: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
    cb();
}
function browserSyncReload(cb) {
    browserSync.reload();
    cb();
}

//Live watch
function watchTask() {
    watch('*.html', browserSyncReload);
    watch(
        ['app/scss/**/*.scss', 'app/**/*.js'],
        series(watchSass, watchJS, browserSyncReload)
    );
}

//Exports
//Watching as default
exports.default = series(watchSass, watchJS, browserSyncServe, watchTask);
//Build without watching
exports.build = series(watchSass, watchJS);
