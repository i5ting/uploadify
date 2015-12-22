# express文件上传、上传到七牛

每个系统最可能需要的一部分

## express里multer

https://github.com/expressjs/multer

它是基于busboy的，官方推荐


## 我的基本诉求

- 上传（可以拖拽最好，支持多张最好）
- 显示进度条
- 可以有各种回调

## 选型

https://github.com/blueimp/jQuery-File-Upload 这个star最多，但nodejs部分代码太老，又要自己定制

于是找到了

https://github.com/hayageek/jquery-upload-file

满足我所有的诉求

主要是简单，它处理浏览器部分的工作，multer再上传到服务器上

## 核心流程2步

- 前端jquery-upload-file
- 后端使用express的multer上传组件


## 经典用法

支持一次上传多个文件。

在app.js里，注意路由处理之前

```
var mount_uploadify = require('uploadify')

mount_uploadify(app,{
  path:'/fileupload',
  fileKey:'myfile',
  multer:{ dest: 'uploads/' },
  callback:function(req){
    console.log(111);
    return req.files
  }
});
```


然后在views层引入js和css文件，以jade为例子（moa-frontend里的实际代码）

定义header引入

https://github.com/moajs/moa-frontend/blob/master/views/layout/head.uploadify.jade

````
link(href='/assets/js/plugins/jquery-upload-file/css/uploadfile.css', rel='stylesheet')
script(src='/assets/js/plugins/jquery-upload-file/js/jquery.uploadfile.min.js')
````

定义布局文件

https://github.com/moajs/moa-frontend/blob/master/views/layout/layout.uploadify.jade


```
doctype html
html
  head
    title= title
    include ./head
    include ./head.uploadify.jade
  body.pace-done
    .wrapper
      include ./menu
      div(id="page-wrapper" class="gray-bg" style="min-height: 761px;")
        include ./topbar
        include ./footer
        block content 
```

编写自己的页面

https://github.com/moajs/moa-frontend/blob/master/views/demo/uploadify.jade

```
extends ../layout/layout.uploadify

block content
  h1= title
  p Welcome to #{title}

  #fileuploader Upload
    
  script.
    $(document).ready(function() {
    	$("#fileuploader").uploadFile({
    		url:"/fileupload/",
    		fileName:"myfile",
        multiple:true,
        dragDrop:true,
        showDownload:true,
        showDelete: true,
        onSuccess: function (files, response, xhr, pd) {
          alert(JSON.stringify(files));
        },
        statusBarWidth:600,
        dragdropWidth:600,
        deleteCallback: function (data, pd) {
            for (var i = 0; i < data.length; i++) {
              alert(data);
                $.post("delete.php", {op: "delete",name: data[i]},
                    function (resp,textStatus, jqXHR) {
                        //Show Message	
                        alert("File Deleted");
                    });
            }
            pd.statusbar.hide(); //You choice.

        },
        downloadCallback:function(filename,pd)
        	{
        		location.href="download.php?filename="+filename;
        	}
    	});
    });
```

## 上传图片到七牛

重要说明，上传到七牛目前只支持单张上传。

在app.js里，注意路由处理之前

```
mount_uploadify(app,{
  debug: false,
  qn: simditor_qn_config.qn,
  path: '/fileupload',
  fileKey: 'myfile',
  multer: simditor_qn_config.multer,
  callback: function(req){
      console.log(req);
  }
});
```

同上面的layout用法，只有onSuccess取值上的不同

```
$("#fileuploader").uploadFile({
    url:"/fileupload/",
    fileName:"myfile",
  multiple:true,
  dragDrop:true,
  showDownload:true,
  showDelete: true,
  onSuccess: function (files, response, xhr, pd) {
    alert(JSON.stringify(response[0].url.split('/').pop()));
  },
  statusBarWidth:300,
  dragdropWidth:300,
  deleteCallback: function (data, pd) {
      for (var i = 0; i < data.length; i++) {
        alert(data);
          $.post("delete.php", {op: "delete",name: data[i]},
              function (resp,textStatus, jqXHR) {
                  //Show Message    
                  alert("File Deleted");
              });
      }
      pd.statusbar.hide(); //You choice.

  },
  downloadCallback:function(filename,pd)
    {
        location.href="download.php?filename="+filename;
    }
});
```


比如http://img.mengxiaoban.cn/FuHkI0z4A5uHk5DtkmdoMhqEiUEt

response[0].url.split('/').pop() == FuHkI0z4A5uHk5DtkmdoMhqEiUEt

和自己绑定的域名拼接到一起就可以了


## 为什么要让uploadify支持七牛？

七牛的sdk实在是一个比一个烂。。。。。

感谢@fengmk2的https://github.com/node-modules/qn

七牛的前端js-sdk

http://developer.qiniu.com/docs/v6/sdk/javascript-sdk.html

https://github.com/qiniu/js-sdk/

- Plupload ，建议 2.1.1 及以上版本
- qiniu.js，SDK主体文件，上传功能\数据处理实现

擦。想使用这个sdk，恶心坏了。。。。。

而且还是基于 GPL V2 协议发布，到底想闹哪样？想死还是不想活啊？

于是改造uploadify

- 文件上传到服务器
- 服务器再上传到七牛
- 成功后返回给客户端

## 代码

很简单，用着也简单，欢迎使用和star

https://github.com/i5ting/uploadify