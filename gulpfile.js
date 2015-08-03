// dependencies
var browserSync = require('browser-sync').create();
var cp = require('child_process');
var gulp = require('gulp');
var path = require('path');
var q = require('q');

// working path
// var wpath = path.join(process.cwd());

// gulp entry point
gulp.task('default', ['start']);
gulp.task('start', ['build', 'reload', 'watch']);

// watch for file changes in wpath
gulp.task('watch', ['reload'], function() {
    gulp.watch('./data/*', ['reload'])
    gulp.watch('./*.html', ['reload'])
    gulp.watch('./maker.js', ['build'])
})

// gulp.task('build', exec.bind('some build command here'))
gulp.task('build', exec.bind(null, 'node maker.js'))
// Reloading browserSync
gulp.task('reload', reload);

// reload browserSync
function reload() {
    var defer = q.defer();

    if (browserSync.active) {
        console.log("reloading")
        browserSync.reload();
        defer.resolve();
    } else
    startServer().then(defer.resolve);

    return defer.promise;
}

// start a browserSync server to index.html directly
function startServer() {
    var defer = q.defer();

    var serverConfig = {
        server: {
            baseDir: __dirname,
            directory: true
        },
        startPath: 'index.html',
        // browser: "google chrome",
        logPrefix: 'SERVER'
    };
    browserSync.init(serverConfig, defer.resolve);

    return defer.promise;
}

// terminal exec task with promise: use as exec.bind(<command>)
function exec(arg) {
    var defer = q.defer();
    cp.exec(arg, function(err, stdout, stderr) {
        if (err) console.log('exec err: '+ err);
        console.log(stdout);
        defer.resolve(err)
    })
    return defer.promise;
}
