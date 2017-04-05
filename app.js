'use strict'

var Koa = require('koa')
var path = require('path')
var util = require('./libs/util')
var wechat = require('./wechat/g')
var wechat_file = path.join(__dirname, './config/wechat.text')
var config = {
	wechat: {
		appID: 'wxaca1a7e49ae599cf',
		appSecret: '74ae9f397e91f99de9c03f7d119110c5',
		token: 'thisistoken',
		getAccessToken: function() {
			return util.readFileAsync(wechat_file)
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