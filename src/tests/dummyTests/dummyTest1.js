"use strict";
define(
    ['echo/utils'],
    function(Utils) {
        var run = function() {
            test("get()", function() {
                var data = {
                    "key1": "value1",
                    "key2": {
                        "key2-1": "value2-1",
                        "key2-2": {
                            "key2-2-1": "value2-2-1"
                        }
                    }
                };
                strictEqual(Utils.get(data, ""), undefined,
                    "empty string as key, expecting 'undefined'");
                strictEqual(Utils.get(data, []), undefined,
                    "empty array as key, expecting 'undefined'");
                equal(Utils.get(data, "key1"), "value1",
                    "simple key, simple value");
                deepEqual(Utils.get(data, "key2"), {
                    "key2-1": "value2-1",
                    "key2-2": {
                        "key2-2-1": "value2-2-1"
                    }
                }, "simple key, complex value");
                equal(Utils.get(data, "key2.key2-1"), "value2-1",
                    "complex key, simple value");
                equal(Utils.get(data, ["key2", "key2-1"]), "value2-1",
                    "complex key represented as an array");
                equal(Utils.get(data, "key1.fakekey", "default value"), "default value",
                    "non-existent key and default value");
                strictEqual(Utils.get(data), undefined,
                    "missing key and no default value");
                strictEqual(Utils.get(undefined, "key1"), undefined,
                    "missing data, existing key");
                strictEqual(Utils.get(), undefined,
                    "both data and key are missing");
            });
        };
        return {run: run};
    }
);