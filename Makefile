SRC_DIR = src
WEB_SDK_DIR = web/sdk
PACK_NAMES = \
	api.pack \
	environment.pack \
	stream-server/controls.pack \
	stream-server/plugins.pack \
	stream-server.pack \
	identity-server/controls.pack \
	identity-server/plugins.pack \
	identity-server.pack \
	third-party/jquery.pack

PACK_FILES_api = \
	$(SRC_DIR)/api.js \
	$(SRC_DIR)/stream-server/api.js \
	$(SRC_DIR)/identity-server/api.js

PACK_FILES_environment = \
	$(SRC_DIR)/utils.js \
	$(SRC_DIR)/events.js \
	$(SRC_DIR)/labels.js \
	$(SRC_DIR)/configuration.js \
	$(WEB_SDK_DIR)/api.pack.js \
	$(SRC_DIR)/user-session.js \
	$(SRC_DIR)/control.js \
	$(SRC_DIR)/plugin.js \
	$(SRC_DIR)/button.js

PACK_FILES_stream-server = \
	$(WEB_SDK_DIR)/stream-server/controls.pack.js \
	$(WEB_SDK_DIR)/stream-server/plugins.pack.js

PACK_FILES_stream-server/controls = $(SRC_DIR)/stream-server/controls/*.js
PACK_FILES_stream-server/plugins = $(SRC_DIR)/stream-server/plugins/*.js

PACK_FILES_identity-server = \
	$(WEB_SDK_DIR)/identity-server/controls.pack.js \
	$(WEB_SDK_DIR)/identity-server/plugins.pack.js

PACK_FILES_identity-server/controls = $(SRC_DIR)/identity-server/controls/*.js
PACK_FILES_identity-server/plugins = $(SRC_DIR)/identity-server/plugins/*.js

PACK_FILES_third-party/jquery = \
	$(SRC_DIR)/third-party/jquery.js \
	$(SRC_DIR)/third-party/jquery.ihint.js \
	$(SRC_DIR)/third-party/jquery.viewport.mini.js \
	$(SRC_DIR)/third-party/jquery.easing-1.3.min.js \
	$(SRC_DIR)/third-party/jquery.fancybox-1.3.4.min.js \
	$(SRC_DIR)/third-party/jquery.ui-1.8.21.min.js

all: clean sdk packs

packs: $(PACK_NAMES)

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
