var express = require('express');
var router = express.Router();
var multer  = require('multer');
var fs = require('fs');
var qn = require('qn');

module.exports = function (app, cfg){
  var debug = cfg.debug;
  // console.log(cfg);
  var upload = multer(cfg.multer);
  
  if(!cfg.path){
    cfg.path = '/fileupload';
  }
  
  if(!cfg.fileKey){
    cfg.fileKey = 'myfile';
  }
  
  if(!cfg.callback){
    cfg.callback = function(req){
      return req.files;
    }
  }
  
  function log(str){
    if (debug == true) {
      console.log(str)
    }
  }
  
  app.post(cfg.path, upload.array(cfg.fileKey), function (req, res, next) {
    if(cfg.qn){
      var client = qn.create(cfg.qn);
      var filepath = req.files[0]['path'];      
      var p = __dirname.split('node_modules')[0];
      var fp = fs.createReadStream(p + '/' + filepath);
      
      client.upload(fp, function (err, result) {
        log(err);
        log(result);
        // {
        //   hash: 'FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
        //   key: 'FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
        //   url: 'http://qtestbucket.qiniudn.com/FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
        //   "x:filename": "foo.txt",
        // }
        var f = req.files[0];
        
        for (var k in result) {
          var v = result[k];
          f[k] = v;
        }
        
        var arr = [];
        arr.push(f)
        
        log(f)
        res.status(200).json(arr);
      });
    }else{
      var json = cfg.callback(req);
      res.status(200).json(json);
    }
  })  
}
