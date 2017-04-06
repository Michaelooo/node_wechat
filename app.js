'use strict'

var Koa = require('koa')
var path = require('path')
var util = require('./libs/util')
var wechat = require('./wechat/g')
var wechat_file = path.join(__dirname, './config/wechat.txt')
var config = {
	wechat: {
		appID: 'wxaca1a7e49ae599cf',
		appSecret: 'a41525310cb860dc814b7d7c3777e75f',
		token: 'thisistoken',
		getAccessToken: function() {
			return util.readFileAsync(wechat_file,'utf-8')
		},
		saveAccessToken: function(data) {
			data = JSON.stringify(data)
			return util.writeFileAsync(wechat_file, data)
		},
	}
}

var app = new Koa()

app.use(wechat(config.wechat))

app.listen(1234)
console.log('listening: 1234')