'use strict';
var gulp = require('gulp');
var csslint = require('gulp-csslint');
var uncss = require('gulp-uncss');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var htmlhint = require("gulp-htmlhint");
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var debug = require('gulp-debug');
var inject = require('gulp-inject');
var tsc = require('gulp-typescript');
var tslint = require('gulp-tslint');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var uglify = require('gulp-uglify');
var through = require('through2');
var babel = require("gulp-babel");
var rename = require("gulp-rename");
var Config = require('./gulpfile.config');
var config = new Config();
var tsProject = tsc.createProject('tsconfig.json');

/**
 * Start a local express server for development
 */
gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon({

        // nodemon our expressjs server
        script: config.expressServer,

        // watch core server file(s) that require server restart on change
        watch: config.expressServerCoreFiles
    })
        .on('start', function onStart() {
            // ensure start only got called once
            if (!called) { cb(); }
            called = true;
        })
        .on('restart', function onRestart() {
            // reload connected browsers after a slight delay
            setTimeout(function reload() {
                browserSync.reload({
                    stream: false
                });
            }, config.BROWSER_SYNC_RELOAD_DELAY);
        });
});

/**
 * Use BrowserSync to keep browser resources in sync with local changes
 */
gulp.task('browser-sync', ['nodemon'], function () {

    // for more browser-sync config options: http://www.browsersync.io/docs/options/
    browserSync({

        // informs browser-sync to proxy our expressjs app which would run at the following location
        proxy: config.browserSyncProxy,

        // informs browser-sync to use the following port for the proxied app
        port: config.browserSyncPort,

        // open the proxied app in browser
        browser: this.browserSyncBrowsers
    });
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function () {
    return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', function () {
    var sourceTsFiles = [config.allTypeScript,
        config.libraryTypeScriptDefinitions];

    var tsResult = gulp.src(sourceTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject))
        .pipe(babel());

    tsResult.dts.pipe(gulp.dest(config.tsOutputPath));
    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tsOutputPath));
});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function () {
    var typeScriptGenFiles = [
        config.tsOutputPath +'/**/*.js',
        config.tsOutputPath +'/**/*.js.map',
        '!' + config.tsOutputPath + '/lib'
    ];

    del(typeScriptGenFiles).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
        });
});

/**
 * Generate a main.js file from all JavaScript files
 */
gulp.task('js', ['ts-lint', 'compile-ts'], function() {
    return gulp.src(config.allJavaScript)
        .pipe(uglify())
        .pipe(concat(config.mainJavaScript))
        .pipe(gulp.dest(config.publicDir));
});

/**
 * Process all css files into a master main.css file in the public directory
 */
gulp.task('css', function() {
    return gulp.src(config.allCSS)
        .pipe(csslint())
        .pipe(csslint.reporter())
        .pipe(csslint.failReporter())
        .pipe(concat(config.mainCSS))
        .pipe(uncss({
            html: config.uncssHtml
        }))
        .pipe(csso())
        .pipe(gulp.dest(config.publicDir));
});

/**
 * Process all html files and output to the public directory.
 */
gulp.task('html', function() {
    return gulp.src(config.allHtml)
        .pipe(htmlhint())
        .pipe(htmlhint.failReporter())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.publicDir));
});

/**
 * Perform a default build of all resources
 */
gulp.task('build', ['ts-lint', 'compile-ts', 'js', 'css', 'html']);

/**
 * Clean the build directory of all resources
 */
gulp.task('clean-build', ['clean-ts'], function() {
    del(config.publicDir).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
        });
});

/**
 * Copy specific files from source to destination.
 */
gulp.task('copy-files', function() {
    for(var i = 0; i < config.copyFiles.length; i++)
    {
        gulp.src(config.copyFiles[i].src + config.copyFiles[i].name)
        .pipe(gulp.dest(config.copyFiles[i].dest));
    }
});

/**
 * Default dev task for watching any changes in local resources and perform a browser sync on change
 */
gulp.task('default', ['browser-sync'], function () {
    gulp.watch(config.allTypeScript, ['ts-lint', 'compile-ts', 'js', browserSync.reload]);
    gulp.watch(config.allCSS,  ['css', 'html', browserSync.reload]);
    gulp.watch(config.allHtml, ['html', browserSync.reload]);
});