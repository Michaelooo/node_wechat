'use strict'
//被动回复用户消息实现
var ejs = require('ejs')
var heredoc = require('heredoc')

var tpl = heredoc(function(){/*
	<xml>
	<ToUserName><![CDATA[<%= toUserName %> ]]></ToUserName>
	<FromUserName><![CDATA[<%= fromUserName %> ]]></FromUserName>
	<CreateTime> <%= createTime %> </CreateTime>
	<MsgType><![CDATA[<%= msgType %>]]></MsgType>
	<% if (msgType === 'Text') {%>
		<Content><![CDATA[<%= content %>]]></Content>	
	<% } else if (msgType === 'image') { %>
		<Image>
		<MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
		</Image>
	<% } else if (msgType === 'voice') { %>
		<Voice>
		<MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
		</Voice>
	<% } else if (msgType === 'video') { %>
		<Video>
		<MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
		<Title><![CDATA[<%= content.title %>]]></Title>
		<Description><![CDATA[<%= content.description %>]]></Description>
		</Video>
	<% } else if (msgType === 'music') %>
		<Music>
		<Title><![CDATA[<%= content.title %>]]></Title>
		<Description><![CDATA[<%= content.description %>]]></Description>
		<MusicUrl><![CDATA[<%= content.musicUrl %>]]></MusicUrl>
		<HQMusicUrl><![CDATA[<%= content.HQmusicUrl %>]]></HQMusicUrl>
		<ThumbMediaId><![CDATA[<%= content.thumbMediaId %>]]></ThumbMediaId>
		</Music>
	<% } else if (msgType === 'news') { %>
		<ArticleCount><% content.length %></ArticleCount>
		<Articles>
		<% content.forEach(function(item,index) { %>
			<item>
			<Title><![CDATA[<%= item.title %>]]></Title> 
			<Description><![CDATA[<%= item.description %>]]></Description>
			<PicUrl><![CDATA[<%= item.picUrl %>]]></PicUrl>
			<Url><![CDATA[<%= item.url %>]]></Url>
			</item>
		<% }) %>
		<Articles>
	<% } %>
	</xml>
*/})


var compile  = ejs.compile(tpl)

exports = module.exports = {
	compiled: compile
}
