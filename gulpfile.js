var gulp = require("gulp");
var merge = require("merge2");
var ts = require("gulp-typescript");
var mocha = require("gulp-spawn-mocha");

var srcProject = ts.createProject("src\\tsconfig.json");
var testProject = ts.createProject("test\\tsconfig.json");

gulp.task("build:src", function() {
    var tsResult = srcProject.src() 
        .pipe(ts(srcProject));

    return merge([
            tsResult.dts.pipe(gulp.dest("lib")),
            tsResult.js.pipe(gulp.dest("lib"))]);
});

gulp.task("build:test", function() {
    var tsResult = testProject.src() 
        .pipe(ts(testProject));

    return tsResult.js.pipe(gulp.dest("test"));
});

gulp.task("test", function() {
    return gulp.src("test\\**\\*.js", {read: false})
        .pipe(mocha({
            R: "nyan"
        }));
});

gulp.watch("src\\**\\*.ts", gulp.series("build:src", "test"));
gulp.watch("test\\**\\*.ts", gulp.series("build:test", "test"));

gulp.task("build", gulp.series("build:src", "build:test"));
gulp.task("default", gulp.series("build"));
