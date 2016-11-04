var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var babel = require('gulp-babel');
var exec = require('child_process').exec;

var pkg = require('./package.json');

function onError(err) {
	console.log(err);
	this.emit('end');
}

gulp.task('js', function () {
	return gulp.src('src/**/*.js')
		.pipe(babel({
			presets: ['react', 'es2015']
		}))
		// .pipe(react())      // complie React JSX template
		.on('error', onError)
		.pipe(gulp.dest('dist/'));
});

gulp.task('build', ['js'], function () {
	return gulp.src('dist/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/'));
});

gulp.task('pack', ['build'], function () {
	// return gulp.src('dist/index.js')
	// 	.pipe(webpack({
	// 		output: {
	// 			filename: 'index.js',
	// 			libraryTarget: 'umd'
	// 		}
	// 	}))
	// 	.on('error', onError)
	// 	.pipe(gulp.dest('build/'));
	return exec('webpack ./dist/index.js ./dist/main.js;', function(err) {
	  if (err) return console.log(err);
	});
});

//注册资源构建任务
gulp.task('res', function () {
	return gulp.src('src/**/*.+(png|jpg|mp3|gif|swf)')
		.pipe(gulp.dest('build/'));
});

gulp.task('watch', function () {
	gulp.watch(['src/**/*.js', 'src/**/*.css'], ['pack']);
});

//注册一个默认任务
gulp.task('default', ['pack', 'res', 'watch']);