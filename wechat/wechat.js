'use strict'

var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var util = require('./util')
var _ = require('lodash')
var fs = require('fs')
var prefix = 'https://api.weixin.qq.com/cgi-bin/'

var api = {
	accessToken: prefix + 'token?grant_type=client_credential', //获取access token
	temp: {
		upload: prefix + 'media/upload?', //新增临时素材
		dowload: prefix +　'media/get?' //获取临时素材
	},
	permanent: {
		upload: prefix + 'material/add_material?', //新增其他类型永久素材
		uploadNews: prefix + 'material/add_news', //新增永久图文素材
		uploadNewsPic: prefix + 'material/uploadimg?', //上传图文消息内的图片获取URL 
		dowload: prefix + 'material/get_material?',
	},
	message: {
		sendByGroup: prefix + 'message/mass/sendall?',
		sendByOpenId: prefix + 'message/mass/send?',
		delete: prefix + 'message/mass/delete?'
	},
	menu: {
		create: 'menu/create?',
		get: 'menu/get?',
		delete: 'menu/delete?',
	}
}

module.exports = Wechat

function Wechat (options) {
	var that = this
	that.appID = options.appID
	that.appSecret = options.appSecret
	that.getAccessToken = options.getAccessToken
	that.saveAccessToken = options.saveAccessToken

	this.getAccessToken().then(function(data) {
		try {
			data = JSON.parse(data)
		}
		catch (e) {
			return that.updateAccessToken()
		}

		if (that.isValidAccessToken(data)) {
			return Promise.resolve(data)
		} else {
			return that.updateAccessToken()
		}
	}).then(function(data) {
		that.access_token = data.access_token
		that.expires_in = data.expires_in
		that.saveAccessToken(data)
	})
}

Wechat.prototype.reply = function() {
	console.log(this)
	var content = this.body
	var message = this.weixin

	var xml = util.tpl(content, message)
	this.status = 200
	this.type = 'application/xml'
	this.body = xml
}

Wechat.prototype.isValidAccessToken = function (data) {
	var access_token = data.access_token
	var expires_in = data.expires_in
	var now = (new Date().getTime())

	if (now < expires_in) {
		return true
	} else {
		return false
	}
}

Wechat.prototype.updateAccessToken = function () {
	var appID = this.appID
	var appSecret = this.appSecret
	var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret
	return new Promise(function(resolve, reject) {
		request({url: url, json: true}).then(function(response) {
			var data = response.body
			var now = (new Date().getTime())
			var expires_in = now + (data.expires_in - 20) * 1000
			data.expires_in = expires_in
			resolve(data)
		})
	})
}

Wechat.prototype.fetchAccessToken = function () {
	var that = this 
	if (this.access_token && this.expires_in) {
		if (this.isValidAccessToken(this)) {
			return Promise.resolve(this)
		}
	}

	this.getAccessToken().then(function(data) {
		try {
			data = JSON.parse(data)
		}
		catch (e) {
			return that.updateAccessToken()
		}

		if (that.isValidAccessToken(data)) {
			return Promise.resolve(data)
		} else {
			return that.updateAccessToken()
		}
	}).then(function(data) {
		that.access_token = data.access_token
		that.expires_in = data.expires_in
		that.saveAccessToken(data)
		return Promise.resolve(data)
	})
}

Wechat.prototype.uploadMaterial = function (type, material, permanent) {
	var that = this

	var form = {}
	var uploadUrl = api.temp.upload
	if (permanent) {
		uploadUrl = api.permanent.upload

		_.extend(form, permanent)
	} 

	if (type === 'pic') {
		uploadUrl = api.permanent.uploadNewsPic  // 
	} else if (type = 'news') {
		uploadUrl = api.permanent.uploadNews //图文消息
		form = material
	} else {
		form.media  = fs.createReadStream(material) //图片视频一类的
	}

	var appID = this.appID
	var appSecret = this.appSecret
	return new Promise(function(resolve, reject) {
		that.fetchAccessToken().then(function(data) {
			var url = uploadUrl + '&access_token=' + data.access_token

			if (!permanent) {
				url += '&type=' + type
			} else {
				form.access_token = data.access_token
			}
			var options = {
				method: 'POST', 
				url: url,
				json: true
			}
			if (type === 'news') {
				options.body = form
			} else {
				options.formData = form
			}
			request(options).then(function(response) {
				var _data = response.body
				if(_data) {
					resolve(_data)
				} else {
					throw new Error('upload failed')
				}
			}).catch(function(err){
				reject(err)
			})
		})
	})
}

Wechat.prototype.sendByGroup = function (type, message, groupId) {
	var that = this

	var msg = {
		filter: {},
		msgtype: type
	}

	msg[type] = message

	if (!groupId) {
		msg.filter.is_to_all = true
	} else {
		msg.filter = {
			is_to_all: false,
			tag_id: groupId
		}
	}

	return new Promise(function(resolve, reject) {
		that.fetchAccessToken().then(function(data) {
			var url = api.message.sendByGroup + '&access_token=' + data.access_token

			var options = {
				method: 'POST', 
				url: url,
				body: msg,
				json: true
			}
			
			request(options).then(function(response) {
				var _data = response.body
				if(_data) {
					resolve(_data)
				} else {
					throw new Error('upload failed')
				}
			}).catch(function(err){
				reject(err)
			})
		})
	})
}

Wechat.prototype.deleteMessage = function (msgId) {
	var that = this

	var msg = {
		msg_id: msgId
	}


	return new Promise(function(resolve, reject) {
		that.fetchAccessToken().then(function(data) {
			var url = api.message.delete + '&access_token=' + data.access_token

			var options = {
				method: 'POST', 
				url: url,
				body: msg,
				json: true
			}
			
			request(options).then(function(response) {
				var _data = response.body
				if(_data) {
					resolve(_data)
				} else {
					throw new Error('send failed')
				}
			}).catch(function(err){
				reject(err)
			})
		})
	})
}

Wechat.prototype.sendByOpenId = function (type, message, openId) {
	var that = this

	var msg = {
		touser: openId,
		msgtype: type,
	}

	msg[type] = message

	return new Promise(function(resolve, reject) {
		that.fetchAccessToken().then(function(data) {
			var url = api.message.sendByOpenId + '&access_token=' + data.access_token

			var options = {
				method: 'POST', 
				url: url,
				body: msg,
				json: true
			}
			
			request(options).then(function(response) {
				var _data = response.body
				if(_data) {
					resolve(_data)
				} else {
					throw new Error('send failed')
				}
			}).catch(function(err){
				reject(err)
			})
		})
	})
}

