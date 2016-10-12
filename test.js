import test from 'ava'

var superkoa = require('superkoa')

var path = require('path')
var app = path.resolve(__dirname, './app')
var image = path.resolve(__dirname, './img/preview.png')

test.cb('POST /fileupload', t => {
    superkoa(app)
    .post('/fileupload')
    .attach('myfile', image)
    .expect(200, function (err, res) {
        t.ifError(err)      
       // fieldname: 'myfile'
        t.is(res.body[0].fieldname, 'myfile', 'res.text == myfile')
        t.end()
    })
})
