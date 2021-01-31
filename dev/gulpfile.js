"use strict";

const gulp        = require("gulp");
const uglify      = require("gulp-uglify");
const babel       = require("gulp-babel");
const maps        = require("gulp-sourcemaps");
const rename      = require("gulp-rename");
const include     = require('gulp-include');
const browserify  = require("browserify");
const babelify    = require("babelify");
const source      = require("vinyl-source-stream");
const buffer      = require('vinyl-buffer');
const sass        = require('gulp-sass');


const scripts = [
    {src: "js/app.js", dest: "../src/static/js", name: "app"}
]

const styles = [
    {src: "scss/app.scss", dest: "../src/static/css", name: "app"}
]

const scriptTasks = scripts.map(script => script.src)
const styleTasks = styles.map(style => style.src)


for (const script of scripts) {
    gulp.task(script.src, function() {
        return browserify({
            entries: [script.src]
        })
        .transform(babelify, {presets: ["env"]})
        .bundle()
        .pipe(source(script.src))
        .pipe(buffer())
        .pipe(maps.init())
        .pipe(rename(`${script.name}.min.js`))
        .pipe(uglify())
        .pipe(maps.write(".maps"))
        .pipe(gulp.dest(script.dest))
    })
}

for (const style of styles) {
    gulp.task(style.src, function() {
        return gulp.src(style.src)
            .pipe(sass({outputStyle: 'compressed'}).on("error", sass.logError))
            .pipe(rename(`${style.name}.min.css`))
            .pipe(gulp.dest(style.dest))
    })
}




gulp.task("watch", gulp.series(...scriptTasks, ...styleTasks, function() {
    gulp.watch(["js/*.js", "js/**/*.js"], gulp.series(...scriptTasks))
    gulp.watch(["scss/*.scss", "scss/**/*.scss"], gulp.series(...styleTasks))
}))

gulp.task("default", gulp.series(...scriptTasks, ...styleTasks))