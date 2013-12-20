Echo.define({
	"id": "third-party-app",
	"title": "Test canvas with third-party application",
	"apps": [{
		"id": "app",
		"script": "{%=baseURLs.tests%}/fixtures/resources/apps/third-party-app.js",
		"component": "Echo.Tests.Fixtures.canvases.ThirdPartyApp"
	}]
});
