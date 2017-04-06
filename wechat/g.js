'use strict'

var sha1 = require('sha1')
var Wechat = require('./wechat')
var getRawBody = require('raw-body')
var util = require('./util')

module.exports = function (options) {
	var that = this
	var wechat = new Wechat(options)
	return function *(next) {
		// console.log(this.query)

		var token = options.token
		var signature = this.query.signature
		var nonce = this.query.nonce
		var timestamp = this.query.timestamp
		var echostr = this.query.echostr

		var str = [token, timestamp, nonce].sort().join('')
		var sha = sha1(str)
		if (this.method === 'GET') {
			if (sha === signature) {
				this.body = echostr + ''
			} else {
				this.body = 'wrong'
			}
		} else if (this.method === 'POST') {
			if (sha !== signature) {
				this.body = 'wrong'
				return false
			}

			var data = yield getRawBody(this.req, {
				length: this.length,
				limit: '1mb',
				encoding: this.charset
			})

			var content = yield util.parseXMLAsync(data)
			var message = util.formatMessage(content.xml)

			if (message.MsgType === 'event') {
				if (message.Event === 'subscribe') {
					var now  = new Date().getTime()
					that.status = 200
					that.type = 'application/text'
					that.body = '<xml>' + 
						'<ToUserName><![CDATA['+ message.FromUserName +']]></ToUserName>' + 
						'<FromUserName><![CDATA['+ message.ToUserName +']]></FromUserName>' + 
						'<CreateTime>'+ now +'</CreateTime>' + 
						'<MsgType><![CDATA[text]]></MsgType>' + 
						'<Content><![CDATA[你好]]></Content>' + 
						'</xml>'
					return
				}
			}
		}

	}
}
