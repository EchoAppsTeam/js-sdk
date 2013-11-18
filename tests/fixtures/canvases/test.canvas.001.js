window.Echo && Echo.Loader && Echo.Loader._storeCanvasConfig && Echo.Loader._storeCanvasConfig("js-sdk-tests/test-canvas-001", {
    "id": "test.canvas.001",
    "title": "Test canvas with Submit and Stream applications",
    "backplane": {
        "serverBaseURL": "https://api.echoenabled.com/v1",
        "busName": "jskit"
    },
    "apps": [{
        "id": "submit",
        "script": "streamserver.pack.js",
        "component": "Echo.StreamServer.Apps.Submit",
        "config": {
            "appkey": "echo.jssdk.tests.aboutecho.com",
            "targetURL": "http://example.com/js-sdk",
            "plugins": [{
                "name": "FormAuth",
                "url": "streamserver/plugins/form-auth.js",
                "submitPermissions": "forceLogin",
                "identityManager": {
                    "login": {"width": 400, "height": 240, "url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="},
                    "signup": {"width": 400, "height": 240, "url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="}
                }
            }]
        }
    }, {
        "id": "stream",
        "script": "streamserver.pack.js",
        "component": "Echo.StreamServer.Apps.Stream",
        "config": {
            "appkey": "echo.jssdk.tests.aboutecho.com",
            "query": "childrenof:http://example.com/sdk/loader/canvases/search/1",
            "plugins": [{
                "name": "InfiniteScroll",
                "url": "streamserver/plugins/infinite-scroll.js"
            }]
        }
    }]
});
