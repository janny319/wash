import gulp from 'gulp';
const { src, dest, series, watch, parallel } = gulp;

import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
const sassCompiler = gulpSass(sass);
import gulpPug from 'gulp-pug';
import { deleteAsync } from 'del';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';

const ROOT = './src';
const DIST = './dist';

const PATH = {
  HTML: `${ROOT}/html`,
  PUG: `${ROOT}/pug`,
  CSS: `${ROOT}/css`,
  SCSS: `${ROOT}/scss`,
  FONT: `${ROOT}/font`,
  JS: `${ROOT}/js`,
  IMG: `${ROOT}/images`,
  DATA: `${ROOT}/data`,
  dist: {
    HTML: `${DIST}/html`,
    CSS: `${DIST}/css`,
    JS: `${DIST}/js`,
    IMG: `${DIST}/images`,
    FONT: `${DIST}/font`,
    DATA: `${DIST}/data`,
  }
};

// SCSS 옵션 설정
const scssOptions = {
  outputStyle: 'expanded',
  indentType: 'space',
  indentWidth: 2,
  sourceComments: true,
};

// SCSS 컴파일 함수
function compileSass() {
  return src(`${PATH.SCSS}/**/*.scss`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassCompiler(scssOptions).on('error', sassCompiler.logError))
    .pipe(sourcemaps.write('./map'))
    .pipe(dest(PATH.CSS))
    .pipe(browserSync.stream());
}

// Pug 컴파일 함수
function compilePug() {
  return src(`${PATH.PUG}/**/*.pug`)
    .pipe(plumber())
    .pipe(gulpPug({ pretty: true }))
    .pipe(dest(PATH.HTML))
    .pipe(browserSync.stream());
}

// 로컬 서버 실행
function server(done) {
  browserSync.init({
    server: { baseDir: ROOT },
  });
  done();
}

// 개발용 파일 감시
function watching() {
  watch(`${PATH.PUG}/**/*.pug`, compilePug);
  watch(`${PATH.SCSS}/**/*.scss`, compileSass);
  watch(`${PATH.JS}/**/*.js`).on('change', browserSync.reload);
}

// dist 폴더 정리
function clean() {
  return deleteAsync([`${DIST}/**`]);
}

// 리소스 복사 task 정의 (즉시 실행 함수가 아님)
const copyImages = () => src(`${PATH.IMG}/**/*`).pipe(dest(PATH.dist.IMG));
const copyHTML = () => src(`${PATH.HTML}/*.html`).pipe(dest(PATH.dist.HTML));
const copyCSS = () => src(`${PATH.CSS}/*.css`).pipe(dest(PATH.dist.CSS));
const copyJS = () => src(`${PATH.JS}/**/*`).pipe(dest(PATH.dist.JS));
const copyData = () => src(`${PATH.DATA}/**/*`).pipe(dest(PATH.dist.DATA));
const copyFont = () => src(`${PATH.FONT}/**/*`).pipe(dest(PATH.dist.FONT));

// 리소스 빌드 함수
const copyAssets = parallel(copyImages, copyHTML, copyCSS, copyJS, copyData, copyFont);

// 배포용 작업
export const build = series(clean, copyAssets);

