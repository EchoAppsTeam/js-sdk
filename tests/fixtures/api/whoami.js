Echo.Tests.Fixtures.api.whoami = {
	"missingOrInvalidAppkey": {
		"result": "error",
		"errorCode": "incorrect_appkey"
	},
	"anonymous": {
		"result": "session_not_found"
	},
	"logged": {
		"poco": {
			"startIndex": 0,
			"itemsPerPage": 1,
			"totalResults": 1,
			"entry": {
				"id": "69844124dee61b03a4f653dcd6501120",
				"accounts": [{
					"identityUrl": "http://somedomain.com/users/fake_user",
					"username": "john.doe",
					"emails": [{
						"value": "john.doe@test.com",
						"primary": "true"
					}],
					"photos": [{
						"type": "avatar",
						"value": "http://c0.echoenabled.com/images/avatar-default.png"
					}],
					"loggedIn": "true"
				}, {
					"identityUrl": "http://js-kit.com/ECHO/user/fake_user",
					"username": "john.doe",
					"emails": [{
						"value": "john.doe@test.com",
						"primary": "true"
					}],
					"photos": [{
						"type": "avatar",
						"value": "http://c0.echoenabled.com/images/avatar-default.png"
					}],
					"loggedIn": "false"
				}]
			}
		},
		"echo": {
			"roles": ["administrator", "moderator"],
			"state": "ModeratorBanned"
		}
	}
};
