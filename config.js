'use strict'

var path = require('path')
var util = require('./libs/util')
var wechat_file = path.join(__dirname, './config/wechat.txt')
var config = {
	wechat: {
		appID: 'wx6a7782ccc4f24f19',
		appSecret: 'e5fcd27b151ea53001c9330919ae2325',
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
module.exports = config