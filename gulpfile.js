// --------------------------------------------------
// Dependencies
// --------------------------------------------------
const gulp = require('gulp');
const del = require('del');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const gutil = require('gulp-util');
const connect = require('gulp-connect');

const config = {
	buildFolder: './build',
	srcFolder: './src',
	scriptsFolder: './src/scripts'
};

// --------------------------------------------------
// Gulp tasks
// --------------------------------------------------
gulp.task('clean', () =>
	del(config.buildFolder)
);

gulp.task('copy', ['clean'], () =>
	gulp.src(`${config.srcFolder}/index.html`).pipe(gulp.dest(config.buildFolder))
);

gulp.task('scripts', ['copy'], () =>
	browserify({ entries: `${config.scriptsFolder}/app.js` })
		.transform('babelify', { presets: ['es2015', 'react'] })
		.bundle()
		.on('error', gutil.log)
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.buildFolder))
);

gulp.task('watch', () =>
	gulp.watch([`${config.srcFolder}/**`], ['scripts'])
);

gulp.task('server', ['scripts'], () =>
	connect.server({
		root: config.buildFolder,
		port: process.env.PORT || 3000
	})
);

gulp.task('default', ['server', 'watch']);
