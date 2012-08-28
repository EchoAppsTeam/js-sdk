var plugin = Echo.Plugin.manifest("VipReplies", "Echo.StreamServer.Controls.Stream.Item");

plugin.events = {
	"Echo.StreamServer.Controls.Submit.onPostComplete": function(topic, args) {
		// TODO: investigate reason why args.postData is undefined
		var question = args.inReplyTo;
//		var question = args.postData && args.postData.inReplyTo;
		if (!question || this.config.get("view") === "public" ||
			!this.component.user.any("role", ["vip"])) return;
		this._markQuestionAsAnswered(question);
		this._copyAnswer(question, args.data);
//		this._copyAnswer(question, args.postData);
	}
};

plugin.methods._request = function(content) {
	var item = this.component;
	Echo.StreamServer.API.request({
		"endpoint": "submit",
		"submissionProxyURL": this.component.config.get("submissionProxyURL"),
		"data": {
			"appkey": item.config.get("appkey"),
			"content": content,
			"target-query": item.config.get("parent.query", ""),
			"sessionID": item.user.get("sessionID", "")
		}
	}).send();
};

plugin.methods._markQuestionAsAnswered = function(question) {
	this._request({
		"verbs": ["http://activitystrea.ms/schema/1.0/mark"],
		"targets": [{"id": question.object.id}],
		"object": {
			"objectTypes": [
				"http://activitystrea.ms/schema/1.0/marker"
			],
			"content": this.config.get("answeredQuestionMarker", "answered")
		}
	});
};

plugin.methods._copyAnswer = function(question, answer) {
	var copyTo = this.config.get("copyTo");
	if (!copyTo) return;
	var title =  question.actor.title || "Guest";
	var avatar = question.actor.avatar || this.component.user.get("defaultAvatar");
	var content = this.substitute({
		"template": '<div class="{plugin.class:special-quest-reply}">' +
				'<div class="{plugin.class:reply}">{data:answerContent}</div>' +
				'<div class="{plugin.class:question-quote}">' +
					'<span class="{plugin.class:author} echo-linkColor">{data:title}</span> asks: ' +
					'<span class="text">"{data:questionContent}"</span>' +
				'</div>' +
			'</div>',
		"data": {
			"answerContent": answer.content,
			"questionContent": Echo.Utils.stripTags(question.object.content),
			"title": title
		}
	});
	this._request({
		"verbs": ["http://activitystrea.ms/schema/1.0/post"],
		"targets": [{"id": copyTo.target}],
		"object": {
			"objectTypes": [
				"http://activitystrea.ms/schema/1.0/comment"
			],
			"content": content
		}
	});
};

plugin.css =
	".{class:data} .{plugin.class:question-quote} { background: #EEEEEE; padding: 10px; margin-bottom: 10px; }" +
	".{class:data} .{plugin.class:question-quote} .{plugin.class:author} { color: #476CB8; }" +
	".{class:data} .{plugin.class:special-quest-reply} .{plugin.class:reply} { font-size: 14px; margin-bottom: 10px; }";

Echo.Plugin.create(plugin);
