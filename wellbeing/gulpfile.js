const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const mqpacker = require("css-mqpacker");

gulp.task('default', function () {
  return gulp.watch('./sass/**/*.scss', function () {
    // style.scssの更新があった場合の処理 
    return gulp.src('./sass/**/*.scss')
    // Sassのコンパイルを実行
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(postcss([mqpacker()]))
        // Sassのコンパイルエラーを表示(これがないと自動的に止まってしまう)
        .pipe(sass().on('error', sass.logError))
        // cssフォルダー以下に保存
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css'))
  });
});


gulp.task('production', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('css'))
});