var gulp = require('gulp');
var bump = require('gulp-bump');
var gp_deploy = require('gulp-gh-pages');
var open = require("gulp-open");
var rename = require("gulp-rename");
require('shelljs/global');

var options = {}
gulp.task('deploy' ,function () {
  gulp.src('./preview/**/*')
    .pipe(gp_deploy(options));
});

gulp.task('rename', function () {
  if (exec('cp ./preview/README.html ./preview/index.html').code !== 0) {
	  echo('Error: rename exec failed');
	  exit(1);
	}	
});

gulp.task('copy_img', function () {
  return gulp.src('./img/**/*')
    .pipe(gulp.dest('./preview/img'));
});

gulp.task('g', ['generate'], function () {
  
});
// 使用i5ting_toc直接生成，不再使用shell
// copy img到preview下面
gulp.task('generate', function () {
  var is_open = true;
  var markd_config = {
  	debug: false
  }
  
  //函数可以返回当前正在执行的项目路径
  var pwd = process.cwd()  
  var source_file = "README.md"
  var source_file_name = pwd + '/' + source_file
  var file_name = source_file_name.split('/').pop();;
  var _file_name = file_name.split('.')[0];

  var dest_file_path = pwd + '/preview/' + _file_name + '.html';

  console.log('pwd=' + pwd);
  console.log('source_file_name=' + source_file_name);
  console.log('dest_file_path=' + dest_file_path);

  require('i5ting_toc')(pwd, source_file_name, dest_file_path, is_open, markd_config);
});

gulp.task('show',['rename','copy_img'] ,function () {
  console.log('show');
});

var watcher = gulp.watch('preview/**/*', ['copy_img', 'rename', 'deploy']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

gulp.task('default',['generate','rename','copy_img'] ,function () {
  console.log('default');
});

// Override the tab size for indenting
// (or simply omit to keep the current formatting)
gulp.task('bump', function(){
  gulp.src('./package.json')
  .pipe(bump({type:'patch', indent: 4 }))
  .pipe(gulp.dest('./'));
});
