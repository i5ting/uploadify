var express = require('express');
var router = express.Router();

var multer  = require('multer');

module.exports = function (app, cfg){
  // console.log(cfg);
  var upload = multer(cfg.multer);
  
  if(!cfg.path){
    cfg.path = '/fileupload';
  }
  
  if(!cfg.fileKey){
    cfg.fileKey = 'myfile';
  }
  
  app.post(cfg.path, upload.array(cfg.fileKey), function (req, res, next) {
    res.status(200).json(req.files)
  })
  
}
