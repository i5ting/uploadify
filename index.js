var router = require('koa-router')()
var multer = require('koa-multer')
var fs = require('fs')
var qn = require('qn')

module.exports = function (app, cfg) {
  var debug = cfg.debug
  var upload = multer(cfg.multer)

  if (!cfg.path) {
    cfg.path = '/fileupload'
  }

  if (!cfg.fileKey) {
    cfg.fileKey = 'myfile'
  }

  if (!cfg.callback) {
    cfg.callback = function (ctx) {
      return ctx.request.files
    }
  }

  function log (str) {
    if (debug === true) {
      console.log(str)
    }
  }

  app.use(router.routes()).use(router.allowedMethods())

  router.post(cfg.path, upload.array(cfg.fileKey), function (ctx, next) {
    log(ctx.request)
    if (cfg.qn) {
      var client = qn.create(cfg.qn)
      var filepath = ctx.req.files[0]['path']
      var p = __dirname.split('node_modules')[0]
      var fp = fs.createReadStream(p + '/' + filepath)
      return new Promise((resolve, reject) => {
        client.upload(fp, function (err, result) {
          log(err)
          log(result)
          if (err) {
            return reject(err)
          }

          var f = ctx.req.files[0]

          for (var k in result) {
            var v = result[k]
            f[k] = v
          }

          var arr = []
          arr.push(f)

          log(f)
          ctx.body = arr
          resolve()
        })
      })
    } else {
      ctx.body = ctx.req
    }
  })
}
