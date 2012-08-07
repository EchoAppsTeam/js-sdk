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
	third-party/jquery.plugins.pack

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

PACK_FILES_third-party/jquery.plugins = \
	$(SRC_DIR)/third-party/jquery.ihint.js \
	$(SRC_DIR)/third-party/jquery.viewport.mini.js \
	$(SRC_DIR)/third-party/jquery.easing-1.3.min.js \
	$(SRC_DIR)/third-party/jquery.fancybox-1.3.4.min.js \
	$(SRC_DIR)/third-party/jquery.ui-1.8.21.min.js

PACK_HEADER = "/*\n * Copyright (c) 2006-`date +%Y` Echo <solutions@aboutecho.com>. All rights reserved.\n * You may copy and modify this script as long as the above copyright notice,\n * this condition and the following disclaimer is left intact.\n * This software is provided by the author "AS IS" and no warranties are\n * implied, including fitness for a particular purpose. In no event shall\n * the author be liable for any damages arising in any way out of the use\n * of this software, even if advised of the possibility of such damage.\n *\n * Assembled at: `date -u`\n */\n"


all: clean sdk packs loader

packs: $(PACK_NAMES) third-party/jquery.pack

%.pack: wrap_file = echo -e "(function(jQuery) {\nvar $$ = jQuery;\n" >> $(WEB_SDK_DIR)/$*.pack.js; \
	cat $(file) >> $(WEB_SDK_DIR)/$*.pack.js; \
	echo -e "})(jQuery);\n" >> $(WEB_SDK_DIR)/$*.pack.js;
%.pack:
	@echo "Assembling $*.pack.js..."
	@echo -e $(PACK_HEADER) >> $(WEB_SDK_DIR)/$*.pack.js
	@$(foreach file, $(shell find $(PACK_FILES_$*)), $(wrap_file))

third-party/jquery.pack:
	@echo "Assembling $@.js..."
	@echo -e $(PACK_HEADER) >> $(WEB_SDK_DIR)/$@.js
	@cat $(SRC_DIR)/third-party/jquery.js >> $(WEB_SDK_DIR)/$@.js
	@cat $(WEB_SDK_DIR)/third-party/jquery.plugins.pack.js >> $(WEB_SDK_DIR)/$@.js
	@rm $(WEB_SDK_DIR)/third-party/jquery.plugins.pack.js

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

loader:
	@echo "Making loader..."
	@rm $(WEB_SDK_DIR)/loader.js
	@cat $(SRC_DIR)/third-party/yepnope.1.5.4-min.js >> $(WEB_SDK_DIR)/loader.js
	@cat $(SRC_DIR)/loader.js >> $(WEB_SDK_DIR)/loader.js
	@echo "Done!"

.PHONY: clean
