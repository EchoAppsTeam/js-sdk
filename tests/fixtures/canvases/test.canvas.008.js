window.Echo && Echo.Loader && Echo.Loader._storeCanvasConfig && Echo.Loader._storeCanvasConfig("js-sdk-tests/test-canvas-008", {
    "id": "test.canvas.008",
    "title": "Test canvas with Auth application",
    "backplane": {
        "serverBaseURL": "https://api.echoenabled.com/v1",
        "busName": "jskit"
    },
    "apps": [{
        "id": "auth",
        "script": "streamserver.pack.js",
        "component": "Echo.StreamServer.BundledApps.Auth.ClientWidget",
        "config": {
            "appkey": "echo.jssdk.tests.aboutecho.com",
            "identityManager": {
                "login": {"width": 400, "height": 240, "url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="},
                "signup": {"width": 400, "height": 240, "url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="}
            }
        }
    }]
});
