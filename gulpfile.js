//  LOAD PACKAGES
var gulp = require('gulp'),
    pkg = require('./package.json'),
    banner = require('gulp-banner'),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    pug = require('gulp-pug'),
    babel = require('gulp-babel'),
    stylus = require('gulp-stylus'),
    koutoSwiss = require('kouto-swiss'),
    
    //  DIRECTORIES
    root = 'application',
    dest = 'release',
    assets = 'includes',
    file = 'wdw',
    min = 'lite',
    css = 'stylesheets',
    js = 'javascripts',
    img = 'images',
    
    //  BANNER COMMENT
    comment =
      '/*\n'+
      ' *  <%= pkg.name %> <%= pkg.version %>\n'+
      ' *  <%= pkg.description %>\n'+
      ' *  <%= pkg.featuring %>\n'+
      ' *  <%= pkg.training %>\n'+
      ' *  <%= pkg.url %>\n'+
      ' *  \n'+
      ' *  Last update on: <%= new Date().getUTCFullYear() %>/'+
      '<%= new Date().getUTCMonth()+1 %>/<%= new Date().getUTCDate() %>\n'+
      ' *  ©<%= new Date().getFullYear() %> <%= pkg.author %>. all rights reserved.\n'+
      ' *  Released under the <%= pkg.license %> license.\n'+
      ' */\n\n';


//  DELETE
gulp.task('del', function() {
  return del.sync(dest);
});


//  BROWSER SYNC
gulp.task('browserSync', function() {
  browserSync({server: {baseDir: dest}});
});


//  PUG
gulp.task('pug', function() {
  return gulp.src(root+'/pug/public/*.pug')
    .pipe(pug({
      pretty: true,
      data: {
        pkg: JSON.parse(require('fs').readFileSync('package.json')),
        workshop01: JSON.parse(require('fs').readFileSync(root+'/data/workshop01.json')),
        workshop02: JSON.parse(require('fs').readFileSync(root+'/data/workshop02.json')),
        workshop03: JSON.parse(require('fs').readFileSync(root+'/data/workshop03.json')),
        workshop04: JSON.parse(require('fs').readFileSync(root+'/data/workshop04.json')),
        workshop05: JSON.parse(require('fs').readFileSync(root+'/data/workshop05.json'))
      }
     }))
    .pipe(gulp.dest(dest));
});


//  BABEL
var babelSrc = [
  root+'/babel/lib/jquery-2.2.4.js',
  root+'/babel/molecules/spans.js',
  root+'/babel/molecules/slides.js',
  root+'/babel/templates/workshop01.js',
  root+'/babel/templates/workshop02.js',
  root+'/babel/templates/workshop03.js',
  root+'/babel/templates/workshop04.js',
  root+'/babel/templates/workshop05.js'
];
gulp.task('babel', function() {
  return gulp.src(babelSrc)
    .pipe(babel())
    .pipe(concat(file+'.js'))
    .pipe(banner(comment, {pkg:pkg}))
    .pipe(gulp.dest(dest+'/'+assets+'/'+js))
    
    .pipe(uglify())
    .pipe(banner(comment, {pkg:pkg}))
    .pipe(rename({extname:'.'+min+'.js'}))
    .pipe(gulp.dest(dest+'/'+assets+'/'+js));
});


//  STYLUS
gulp.task('stylus', function() {
  return gulp.src(root+'/stylus/app-ltr.styl')
    .pipe(stylus({'use': koutoSwiss()}))
    .pipe(banner(comment, {pkg:pkg}))
    .pipe(rename(file+'.css'))
    .pipe(gulp.dest(dest+'/'+assets+'/'+css))
    
    .pipe(uglifycss())
    .pipe(banner(comment, {pkg:pkg}))
    .pipe(rename({extname:'.'+min+'.css'}))
    .pipe(gulp.dest(dest+'/'+assets+'/'+css));
});


//  IMAGES
gulp.task('img', function() {
  return gulp.src(root+'/img/**/*')
    .pipe(gulp.dest(dest+'/'+assets+'/'+img));
});


//  HTACCESS
gulp.task('htaccess', function() {
  return gulp.src('.htaccess')
    .pipe(gulp.dest(dest));
});


//  WATCH
gulp.task('watch', function() {
  gulp.watch([root+'/pug/**/*', root+'/data/**/*'], ['pug', browserSync.reload]);
  gulp.watch(root+'/babel/**/*', ['babel', browserSync.reload]);
  gulp.watch(root+'/stylus/**/*', ['stylus', browserSync.reload]);
  gulp.watch(root+'/img/**/*', ['img', browserSync.reload]);
});


//  DEFAULT
gulp.task('default', function() {
  runSequence(['del', 'pug', 'babel', 'stylus', 'img', 'browserSync', 'watch']);
});


//  RELEASE
gulp.task('release', function() {
  runSequence(['del', 'pug', 'babel', 'stylus', 'img', 'htaccess']);
});