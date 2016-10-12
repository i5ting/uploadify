#!/usr/bin/env node

var koa = require ('koa');
var app = new koa();
var static = require ('koa-static');
var bodyParser = require ('koa-bodyparser');
var router = require ('koa-router')();
var path = require('path');
var open = require("open");
var views = require ('koa-views');

//view engine setup
app.use(views(__dirname + '/views', {
  extension: 'jade'
}));

app.use (bodyParser());
app.use ( static(__dirname + '/.'));


var mount_uploadify = require('.')

mount_uploadify (app, {
  debug:true,
  path:'/fileupload',
  fileKey:'myfile',
  multer:{ dest: 'uploads/' },
	qn:{
		accessKey: 'PqLfYe68_HKhnCL0qszXD4xRFj57U8cnBASJN0x7',
		secretKey: 'KFjdvN4aOmqQG_lV2YViY7tHPZOKROA8cmK7J5CH',
		bucket: 'mengxiaoban',
		origin: 'http://{bucket}.u.qiniudn.com',
		// timeout: 3600000, // default rpc timeout: one hour, optional
		// if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/`
		// uploadURL: 'http://up.qiniu.com/',
	}
});


app.use (router.routes())
   .use (router.allowedMethods());

router.get('/', function (ctx, next) {
  console.log('index')
  return ctx.render('index', {    
  });
});
// 随机端口3000 - 10000 之间
app.listen(5024);

// open("http://127.0.0.1:5024");

