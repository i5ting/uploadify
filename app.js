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
  debug: false,
  path: '/fileupload',
  fileKey: 'myfile',
  multer: { dest: 'uploads/' },
	qn: require('./qn')
});

app.use (router.routes())
   .use (router.allowedMethods());

router.get('/', function (ctx, next) {
  console.log('index')
  return ctx.render('index', {    
  });
});
// 随机端口3000 - 10000 之间
// app.listen(5024);

// open("http://127.0.0.1:5024");
// console.log(router.stack)

module.exports = app