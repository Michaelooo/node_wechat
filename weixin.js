//用于处理自动回复信息的处理逻辑
'use strict'
exports.reply = function* (next) {
	console.log(this + " " + next)
	var message = this.weixin
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
		}
		this.body = reply
	}

	yield next
}
