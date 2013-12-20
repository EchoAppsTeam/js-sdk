Echo.define({
	"id": "incomplete-app-config",
	"title": "Test canvas with incomplete app configs",
	"apps": [{
		"id": "app1"
	}, {
		"id": "app2",
		"component": "fixtures/resources/apps/nonexistent"
	}, {
		"id": "app3",
		"component": "Echo.Tests.Fixtures.canvases.Nonexistent"
	}]
});
