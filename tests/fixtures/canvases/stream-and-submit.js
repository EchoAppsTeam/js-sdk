Echo.define({
	"id": "stream-and-submit",
	"title": "Test canvas with Submit and Stream applications",
	"backplane": {
		"serverBaseURL": "https://api.echoenabled.com/v1",
		"busName": "jskit"
	},
	"apps": [{
		"id": "submit",
		"script": "{%=baseURLs.sdk%}/streamserver.sdk.js",
		"component": "echo/streamserver/bundled-apps/submit/client-widget",
		"config": {
			"appkey": "echo.jssdk.tests.aboutecho.com",
			"targetURL": "http://example.com/js-sdk",
			"plugins": [{
				"component": "echo/streamserver/plugins/form-auth",
				"submitPermissions": "forceLogin",
				"identityManager": {
					"login": {"width": 400, "height": 240, "url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="},
					"signup": {"width": 400, "height": 240, "url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="}
				}
			}]
		}
	}, {
		"id": "stream",
		"script": "{%=baseURLs.sdk%}/streamserver.sdk.js",
		"component": "echo/streamserver/bundled-apps/stream/client-widget",
		"config": {
			"appkey": "echo.jssdk.tests.aboutecho.com",
			"query": "childrenof:http://example.com/sdk/loader/canvases/search/1",
			"plugins": [{
				"component": "echo/streamserver/plugins/infinite-scroll"
			}]
		}
	}]
});
