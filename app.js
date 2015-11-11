#!/usr/bin/env node

var express  = require('express');
var app      = express();
var path     = require('path');
var open     = require("open");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, '/.')));

var mount_uploadify = require('.')

mount_uploadify(app,{
  debug:true,
  path:'/fileupload',
  fileKey:'myfile',
  multer:{ dest: 'uploads/' },
  callback:function(req){
    console.log(111);
    return {
      a:1,
      files:req.files
    }
  }
});

app.get('/', function (req, res) {
  res.render('index', {
    
  })
})
// 随机端口3000 - 10000 之间
app.listen(5024)

open("http://127.0.0.1:5024");

