'use strict'

var Koa = require('koa')
var path = require('path')
var util = require('./libs/util')
var wechat = require('./wechat/g')
var weixin = require('./weixin')
var config = require('./config')
var wechat_file = path.join(__dirname, './config/wechat.txt')

var app = new Koa()
// console.log('app.js' + config.wechat + weixin.replay)
app.use(wechat(config.wechat, weixin.reply))

app.listen(1234)
console.log('listening: 1234')