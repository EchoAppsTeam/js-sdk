SRC_DIR = src
WEB_SDK_DIR = web/sdk
PACK_NAMES = \
	environment.pack \
	stream-server.pack \
	stream-server/controls.pack \
	stream-server/plugins.pack \
	stream-server/api.pack \
	identity-server.pack \
	identity-server/controls.pack \
	identity-server/plugins.pack \
	identity-server/api.pack

PACK_FILES_environment = \
	$(SRC_DIR)/utils.js \
	$(SRC_DIR)/events.js \
	$(SRC_DIR)/labels.js \
	$(SRC_DIR)/configuration.js \
	$(SRC_DIR)/user-session.js \
	$(SRC_DIR)/api.js \
	$(SRC_DIR)/control.js

PACK_FILES_stream-server = \
	$(WEB_SDK_DIR)/stream-server/controls.pack.js \
	$(WEB_SDK_DIR)/stream-server/plugins.pack.js \
	$(WEB_SDK_DIR)/stream-server/api.pack.js

PACK_FILES_stream-server/controls = $(SRC_DIR)/stream-server/controls/*.js
PACK_FILES_stream-server/plugins = $(SRC_DIR)/stream-server/plugins/*.js
PACK_FILES_stream-server/api = $(SRC_DIR)/api.js $(SRC_DIR)/stream-server/api.js

PACK_FILES_identity-server = \
	$(WEB_SDK_DIR)/identity-server/controls.pack.js \
	$(WEB_SDK_DIR)/identity-server/plugins.pack.js \
	$(WEB_SDK_DIR)/identity-server/api.pack.js

PACK_FILES_identity-server/controls = $(SRC_DIR)/identity-server/controls/*.js
PACK_FILES_identity-server/plugins = $(SRC_DIR)/identity-server/plugins/*.js
PACK_FILES_identity-server/api = $(SRC_DIR)/api.js $(SRC_DIR)/identity-server/api.js

all: clean sdk packs docs

packs: $(PACK_NAMES)

stream-server.pack: stream-server/controls.pack stream-server/plugins.pack stream-server/api.pack
identity-server.pack: identity-server/controls.pack identity-server/plugins.pack identity-server/api.pack

%.pack:
	@echo "Assembling $@.js..."
	@touch $(WEB_SDK_DIR)/$@.js
	@-cat $(PACK_FILES_$*) >> $(WEB_SDK_DIR)/$@.js

clean:
	@echo "Removing old files..."
	@rm -rf web/sdk/*

sdk:
	@echo "Making SDK..."
	@cp -r src/* web/sdk
	@cp -r tests web/sdk
	@echo "Done!"

docs:
	@echo "Removing old docs..."
	rm -rf web/sdk/docs
	@echo "Making docs..."
	jsduck src --ignore-global --title="Echo JS SDK" --pretty-json --output web/sdk/docs
	@echo "Done!"

.PHONY: clean
