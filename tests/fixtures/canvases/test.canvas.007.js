Echo.Tests.Fixtures.canvases["js-sdk-tests/test-canvas-007"] = {
    "id": "test.canvas.007",
    "title": "Test canvas with custom development/production scripts definition",
    "backplane": {
        "serverBaseURL": "https://api.echoenabled.com/v1",
        "busName": "jskit"
    },
    "apps": [{
        "id": "test.apps.scripts",
        "scripts": {
            "dev": "../../../tests/fixtures/resources/loader/scripts.dev.js",
            "prod": "../../tests/fixtures/resources/loader/scripts.prod.js"
        },
        "component": "Echo.Tests.Apps.TestApp",
        "config": {
            "appkey": "echo.jssdk.tests.aboutecho.com"
        }
    }]
};
