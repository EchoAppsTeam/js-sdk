var plugin = Echo.Plugin.manifest("VipReplies", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var component = this.component;
	if (this.config.get("view") === "public" ||
		!component.user.any("role", ["vip"])) return;
};

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Submit.onPostComplete": function(topic, args) {
		var question = args.inReplyTo;
		if (!question) return;
		plugin._markQuestionAsAnswered(question);
		plugin._copyAnswer(question, args.postData);
	}
};

plugin.methods._request = function(data) {
	Echo.StreamServer.API.request({
		"endpoint": "submit",
		"submissionProxyURL": this.component.config.get("submissionProxyURL"),
		"data": data
	}).send();
};

plugin.methods._markQuestionAsAnswered = function(question) {
	this._request({
		"verb": "mark",
		"target": question.object.id,
		"markers": this.config.get("answeredQuestionMarker", "answered")
	});
};

plugin.methods._copyAnswer = function(question, answer) {
	var copyTo = this.config.get("copyTo");
	if (!copyTo) return;
	var title =  question.actor.title || "Guest";
	var avatar = question.actor.avatar || this.component.user.get("defaultAvatar");
	var content = this.substitute(
		'<div class="{plugin.class:special-quest-reply}">' +
			'<div class="{plugin.class:reply}">{data:answerContent}</div>' +
			'<div class="{plugin.class:question-quote}">' +
				'<span class="{plugin.class:author} echo-linkColor">{data:title}</span> asks: ' +
				'<span class="text">"{data:questionContent}"</span>' +
			'</div>' +
		'</div>', {
			"answerContent": answer.content,
			"questionContent": Echo.Utils.stripTags(question.object.content),
			"title": title
		});
	this._request($.extend({"verb": "post", "content": content}, copyTo));
};

plugin.css =
	".{class:data} .{plugin.class:question-quote} { background: #EEEEEE; padding: 10px; margin-bottom: 10px; }" +
	".{class:data} .{plugin.class:question-quote} .{plugin.class:author} { color: #476CB8; }" +
	".{class:data} .{plugin.class:special-quest-reply} .{plugin.class:reply} { font-size: 14px; margin-bottom: 10px; }";

Echo.Plugin.create(plugin);
