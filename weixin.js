//用于处理自动回复信息的处理逻辑
'use strict'

var config = require('./config')
var Wechat = require('./wechat/wechat')

var wechatAPI = new Wechat(config.wechat)
exports.reply = function* (next) {
	var message = this.weixin
	console.log(message)
	if (message.MsgType === 'event') {
		if (message.Event === 'subscribe') {
			if (message.EventKey) {
				console.log('通过二维码扫描'+ message.EventKey + ' ' + message.ticket)
			}
			this.body = '恭喜订阅' + ' 消息ID：' + message.MsgId
		} else if (message.Event === 'unsubscribe'){
			this.body = ''
			console.log('取关')
		} else if (message.Event === 'LOCATION') {
			this.body = '你当前的位置是： '+ message.Latitude + '' + message.Longitude + '-' + message.Precision 
		} else if (message.Event === 'CLICK') {
			this.body = '你点击了菜单： '+ message.EventKey 
		} else if (message.Event === 'SCAN') {
			this.body = '关注后扫描二维码： '+ message.EventKey + ' ' + message.ticket 
		} else if (message.Event === 'VIEW') {
			this.body = '你点击了菜单中的链接： '+ message.EventKey
		}
	} else if (message.MsgType === 'text') {
		var content = message.Content
		var reply = '你说的' + message.Content + '我听不懂'

		if (content === '1') {
			reply = '1'
		} else if (content === '2') {
			reply = '2'
		} else if (content === '3') {
			reply = '3'
		} else if (content === '4') {
			reply = [{
				title: '技术改变世界',
				description: '只是个描述',
				picUrl: '',
				url: 'https://github.com/'
			},{
				title: '技术改变世界',
				description: '只是个描述',
				picUrl: '',
				url: 'https://github.com/'
			},{
				title: '技术改变世界',
				description: '只是个描述',
				picUrl: '',
				url: 'https://github.com/'
			}]
		} else if (content === '5') {
			var data = yield wechatAPI.uploadMaterial('image', __dirname + '/2.jpg')

			reply = {
				type: 'image',
				mediaId: data.media_id
			}
		} else if (content === '6') {
			var data = yield wechatAPI.uploadMaterial('video', __dirname + '/2.mp4')

			reply = {
				type: 'video',
				title: 'video',
				description: 'none',
				mediaId: data.media_id
			}
		} else if (content === '7') {
			var data = yield wechatAPI.uploadMaterial('image', __dirname + '/2.jpg')

			reply = {
				type: 'music',
				title: 'music',
				description: 'relax',
				musicUrl: '',
				thumbMediaId: data.media_id,
				mediaId: data.media_id
			}
		}
		this.body = reply
	}

	yield next
}
