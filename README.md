# uploadify

![](img/preview.png)

Artwork by [i5ting](http://www.github.com/i5ting/).

[![Deps](https://david-dm.org/i5ting/uploadify.svg)](https://david-dm.org/i5ting/uploadify) 
[![npm](https://img.shields.io/npm/v/uploadify.svg)](https://www.npmjs.com/package/uploadify)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/i5ting/uploadify/master/LICENSE.md)
[![npm](https://img.shields.io/npm/dt/uploadify.svg)](https://www.npmjs.com/package/uploadify)


## Install

    [sudo]npm install --save uploadify


## Code

### express

```
var mount_uploadify = require('uploadify')

mount_uploadify(app,{
  path:'/fileupload',
  fileKey:'myfile',
  multer:{ dest: 'uploads/' }
});
```

### jade

```
include node_modules/uploadify/views/header
```

### html

```
extends layout

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

more info see http://hayageek.com/docs/jquery-upload-file.php

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## 版本历史

- v1.0.0 初始化版本

## 欢迎fork和反馈

- write by `i5ting` i5ting@126.com

如有建议或意见，请在issue提问或邮件

## License

this repo is released under the [MIT
License](http://www.opensource.org/licenses/MIT).
