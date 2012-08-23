// vim: set ts=8 sts=8 sw=8 noet:
/*
 * Copyright (c) 2006-2011 Echo <solutions@aboutecho.com>. All rights reserved.
 * You may copy and modify this script as long as the above copyright notice,
 * this condition and the following disclaimer is left intact.
 * This software is provided by the author "AS IS" and no warranties are
 * implied, including fitness for a particular purpose. In no event shall
 * the author be liable for any damages arising in any way out of the use
 * of this software, even if advised of the possibility of such damage.
 */

var plugin = Echo.Plugin.manifest("VipReplies", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var component = this.component;
	if (this.config.get("view") == "public" ||
		!component.user.any("role", ["vip"])) return;
};

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Submit.onPostComplete": function(topic, args) {
		var question = args.inReplyTo;
		if (!question) return;
		plugin.markQuestionAsAnswered(question, application);
		plugin.copyAnswer(question, args.postData, application);
	}
};

plugin.request = function(application, data) {
	$.get(plugin.config.get(application, "submissionProxyURL", "", true), {
		"appkey": application.config.get("appkey"),
		"content": $.object2JSON(data),
		"sessionID": application.user.get("sessionID", "")
	}, function() {}, "jsonp");
};

plugin.markQuestionAsAnswered = function(question, application) {
	plugin.request(application, {
		"verb": "mark",
		"target": question.object.id,
		"markers": plugin.config.get(application, "answeredQuestionMarker", "answered")
	});
};

plugin.copyAnswer = function(question, answer, application) {
	var copyTo = plugin.config.get(application, "copyTo");
	if (!copyTo) return;
	var title =  question.actor.title || "Guest";
	var avatar = question.actor.avatar || application.user.get("defaultAvatar");
	var content =
		'<div class="special-quest-reply">' +
			'<div class="reply">' + answer.content + '</div>' +
			'<div class="question-quote">' +
				'<span class="author echo-linkColor">' + title + '</span> asks: ' +
				'<span class="text">"' + $.stripTags(question.object.content) + '"</span>' +
			'</div>' +
		'</div>';
	plugin.request(application, $.extend({"verb": "post", "content": content}, copyTo));
};

plugin.css =
	".echo-item-data .question-quote { background: #EEEEEE; padding: 10px; margin-bottom: 10px; }" +
	".echo-item-data .question-quote .author { color: #476CB8; }" +
	".echo-item-data .special-quest-reply .reply { font-size: 14px; margin-bottom: 10px; }";

Echo.Plugin.create(plugin);