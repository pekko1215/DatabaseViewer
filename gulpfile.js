const gulp = require('gulp'),
    riot = require('gulp-riot'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    riotify = require('riotify');

gulp.task('browserify', () => {
    return browserify('./src/main.js')
        .transform(babelify, {
            presets: [
                ['@babel/preset-env', {
                    targets: {
                        node: 'current'
                    }
                }]
            ]
        })
        .transform(riotify)
        .bundle()
        .on('error', function(err) {
            console.log(`Error : ${err}`);
            // console.log(err)
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./public/js/'))
})

gulp.task('watch', gulp.series('browserify', () => {
    gulp.watch('./src/tags/**/*.riot', gulp.task('browserify'));
    gulp.watch('./src/**/*.js', gulp.task('browserify'));
}));