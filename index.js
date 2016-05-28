var koa = require('koa');
var router = require ('koa-router')();
var multer  = require('koa-multer');
var fs = require('fs');
var qn = require('qn');

module.exports = function (app, ctx){
  var debug = ctx.debug;
  var upload = multer(ctx.multer);
  
  if(!ctx.path){
    ctx.path = '/fileupload';
  }
  
  if(!ctx.fileKey){
    ctx.fileKey = 'myfile';
  }
  
  if(!ctx.callback){
    ctx.callback = function(ctx){
      return ctx.request.files;
    }
  }
  
  function log(str){
    if (debug == true) {
      console.log(str)
    }
  }
  
  app.use (router.routes())
     .use (router.allowedMethods());
  router.post(ctx.path, upload.array(ctx.fileKey), function (ctx, next) {
    if(ctx.qn){
      var client = qn.create(ctx.qn);
      var filepath = ctx.request.files[0]['path'];      
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
        var f = ctx.request.files[0];
        
        for (var k in result) {
          var v = result[k];
          f[k] = v;
        }
        
        var arr = [];
        arr.push(f)
        
        log(f)
        ctx.status(200).json(arr);
      });
    }else{
      var json = ctx.request;
      return ctx.body = json;
    }
  })  
}
